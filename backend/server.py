from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import anthropic

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Anthropic Claude client
claude_client = anthropic.AsyncAnthropic(api_key=os.environ.get('ANTHROPIC_API_KEY', ''))

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Child(BaseModel):
    child_id: str = Field(default_factory=lambda: f"child_{uuid.uuid4().hex[:12]}")
    parent_id: str
    name: str
    age: int
    grade: int  # 1-6 for primary school
    subjects: List[str] = ["matematicas", "lengua", "ciencias", "ingles"]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChildCreate(BaseModel):
    name: str
    age: int
    grade: int

class Skill(BaseModel):
    skill_id: str
    subject: str
    name: str
    description: str
    grade_level: int
    prerequisites: List[str] = []

class Exercise(BaseModel):
    exercise_id: str = Field(default_factory=lambda: f"ex_{uuid.uuid4().hex[:12]}")
    child_id: str
    subject: str
    skill_ids: List[str]
    question: str
    correct_answer: str
    options: Optional[List[str]] = None
    difficulty: int = 1  # 1-3
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Attempt(BaseModel):
    attempt_id: str = Field(default_factory=lambda: f"att_{uuid.uuid4().hex[:12]}")
    child_id: str
    exercise_id: str
    skill_ids: List[str]
    subject: str
    is_correct: bool
    answer_given: str
    hints_used: int = 0
    time_seconds: Optional[int] = None
    error_type: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AttemptCreate(BaseModel):
    exercise_id: str
    answer_given: str
    hints_used: int = 0
    time_seconds: Optional[int] = None

class ChatMessage(BaseModel):
    message_id: str = Field(default_factory=lambda: f"msg_{uuid.uuid4().hex[:12]}")
    child_id: str
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None  # e.g., "homework", "practice", "explain"

class DailyCheckIn(BaseModel):
    checkin_id: str = Field(default_factory=lambda: f"chk_{uuid.uuid4().hex[:12]}")
    child_id: str
    mood: str  # "happy", "neutral", "tired", "frustrated"
    energy: int  # 1-5
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckInCreate(BaseModel):
    mood: str
    energy: int
    note: Optional[str] = None

# ============== AUTH HELPERS ==============

async def get_current_user(request: Request) -> User:
    """Get current user from session token in cookie or header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Sesión inválida")
    
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Sesión expirada")
    
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    return User(**user)

# ============== AUTH ENDPOINTS ==============

@api_router.get("/auth/session")
async def exchange_session(request: Request, response: Response, session_id: str):
    """Exchange session_id from Emergent Auth for user data and set cookie"""
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    try:
        async with httpx.AsyncClient() as http_client:
            auth_response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Error de autenticación")
            
            auth_data = auth_response.json()
    except Exception as e:
        logger.error(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Error de autenticación")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    existing_user = await db.users.find_one({"email": auth_data["email"]}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": auth_data["name"], "picture": auth_data.get("picture")}}
        )
    else:
        new_user = {
            "user_id": user_id,
            "email": auth_data["email"],
            "name": auth_data["name"],
            "picture": auth_data.get("picture"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(new_user)
    
    session_token = auth_data.get("session_token", f"session_{uuid.uuid4().hex}")
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user

@api_router.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user by clearing session"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"message": "Sesión cerrada"}

# ============== CHILDREN ENDPOINTS ==============

@api_router.get("/children", response_model=List[Dict])
async def get_children(user: User = Depends(get_current_user)):
    """Get all children for current parent"""
    children = await db.children.find({"parent_id": user.user_id}, {"_id": 0}).to_list(100)
    return children

@api_router.post("/children")
async def create_child(child_data: ChildCreate, user: User = Depends(get_current_user)):
    """Create a new child profile"""
    child = Child(
        parent_id=user.user_id,
        name=child_data.name,
        age=child_data.age,
        grade=child_data.grade
    )
    child_dict = child.model_dump()
    child_dict["created_at"] = child_dict["created_at"].isoformat()
    await db.children.insert_one(child_dict)
    child_dict.pop("_id", None)
    return child_dict

@api_router.get("/children/{child_id}")
async def get_child(child_id: str, user: User = Depends(get_current_user)):
    """Get a specific child"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    return child

@api_router.delete("/children/{child_id}")
async def delete_child(child_id: str, user: User = Depends(get_current_user)):
    """Delete a child profile"""
    result = await db.children.delete_one({"child_id": child_id, "parent_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    return {"message": "Perfil eliminado"}

# ============== SKILLS DATA ==============

SKILLS_DATA = {
    "matematicas": [
        {"skill_id": "mat_suma_basica", "name": "Sumas básicas", "description": "Sumas de números de un dígito", "grade_level": 1},
        {"skill_id": "mat_resta_basica", "name": "Restas básicas", "description": "Restas de números de un dígito", "grade_level": 1},
        {"skill_id": "mat_suma_llevadas", "name": "Sumas con llevadas", "description": "Sumas con llevadas de dos dígitos", "grade_level": 2},
        {"skill_id": "mat_resta_llevadas", "name": "Restas con llevadas", "description": "Restas con llevadas", "grade_level": 2},
        {"skill_id": "mat_multiplicacion", "name": "Multiplicación", "description": "Tablas de multiplicar", "grade_level": 3},
        {"skill_id": "mat_division", "name": "División", "description": "División básica", "grade_level": 3},
        {"skill_id": "mat_fracciones", "name": "Fracciones", "description": "Operaciones con fracciones", "grade_level": 4},
        {"skill_id": "mat_decimales", "name": "Decimales", "description": "Números decimales", "grade_level": 5},
        {"skill_id": "mat_problemas", "name": "Problemas", "description": "Resolución de problemas", "grade_level": 3},
    ],
    "lengua": [
        {"skill_id": "len_lectura_fluida", "name": "Lectura fluida", "description": "Leer con fluidez y expresión", "grade_level": 1},
        {"skill_id": "len_comprension_literal", "name": "Comprensión literal", "description": "Entender información explícita", "grade_level": 2},
        {"skill_id": "len_comprension_inferencial", "name": "Comprensión inferencial", "description": "Deducir información implícita", "grade_level": 3},
        {"skill_id": "len_ortografia_bv", "name": "Ortografía B/V", "description": "Uso correcto de B y V", "grade_level": 3},
        {"skill_id": "len_ortografia_hache", "name": "Ortografía H", "description": "Uso correcto de la H", "grade_level": 3},
        {"skill_id": "len_acentuacion", "name": "Acentuación", "description": "Reglas de acentuación", "grade_level": 4},
        {"skill_id": "len_gramatica", "name": "Gramática", "description": "Estructura gramatical", "grade_level": 4},
        {"skill_id": "len_redaccion", "name": "Redacción", "description": "Escritura de textos", "grade_level": 5},
    ],
    "ciencias": [
        {"skill_id": "cie_seres_vivos", "name": "Seres vivos", "description": "Características de seres vivos", "grade_level": 1},
        {"skill_id": "cie_cuerpo_humano", "name": "Cuerpo humano", "description": "Partes y funciones del cuerpo", "grade_level": 2},
        {"skill_id": "cie_plantas", "name": "Plantas", "description": "Tipos y partes de plantas", "grade_level": 2},
        {"skill_id": "cie_animales", "name": "Animales", "description": "Clasificación de animales", "grade_level": 3},
        {"skill_id": "cie_ecosistemas", "name": "Ecosistemas", "description": "Relaciones en ecosistemas", "grade_level": 4},
        {"skill_id": "cie_materia", "name": "Materia", "description": "Estados de la materia", "grade_level": 4},
    ],
    "ingles": [
        {"skill_id": "ing_vocabulario_basico", "name": "Vocabulario básico", "description": "Palabras comunes", "grade_level": 1},
        {"skill_id": "ing_colores_numeros", "name": "Colores y números", "description": "Colors and numbers", "grade_level": 1},
        {"skill_id": "ing_familia", "name": "Familia", "description": "Family members", "grade_level": 2},
        {"skill_id": "ing_presente_simple", "name": "Presente simple", "description": "Simple present tense", "grade_level": 3},
        {"skill_id": "ing_preguntas", "name": "Preguntas", "description": "Question formation", "grade_level": 3},
    ]
}

@api_router.get("/skills")
async def get_skills(subject: Optional[str] = None, grade: Optional[int] = None):
    """Get available skills, optionally filtered"""
    if subject and subject in SKILLS_DATA:
        skills = SKILLS_DATA[subject]
    else:
        skills = []
        for subj_skills in SKILLS_DATA.values():
            skills.extend(subj_skills)
    
    if grade:
        skills = [s for s in skills if s["grade_level"] <= grade]
    
    return skills

# ============== EXERCISES & ATTEMPTS ==============

@api_router.post("/exercises/generate")
async def generate_exercise(
    child_id: str,
    subject: str,
    skill_id: Optional[str] = None,
    user: User = Depends(get_current_user)
):
    """Generate an exercise using AI"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    # Get skill info
    skill_info = None
    if skill_id and subject in SKILLS_DATA:
        for s in SKILLS_DATA[subject]:
            if s["skill_id"] == skill_id:
                skill_info = s
                break
    
    if not skill_info:
        # Pick a random skill for the grade
        import random
        grade_skills = [s for s in SKILLS_DATA.get(subject, []) if s["grade_level"] <= child["grade"]]
        if grade_skills:
            skill_info = random.choice(grade_skills)
    
    if not skill_info:
        raise HTTPException(status_code=400, detail="No hay habilidades disponibles")
    
    # Generate exercise with OpenAI
    prompt = f"""Genera un ejercicio de {subject} para un niño de {child['age']} años en {child['grade']}º de primaria.
Habilidad: {skill_info['name']} - {skill_info['description']}

Responde SOLO con un JSON válido con esta estructura exacta:
{{
    "question": "pregunta del ejercicio",
    "correct_answer": "respuesta correcta",
    "options": ["opción1", "opción2", "opción3", "opción4"],
    "hint1": "pista suave",
    "hint2": "pista más directa"
}}

El ejercicio debe ser apropiado para la edad y nivel. Las opciones deben incluir la respuesta correcta."""

    try:
        response = await claude_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            system="Eres un tutor de primaria experto. Genera ejercicios educativos en español. Responde SOLO con JSON válido, sin explicaciones adicionales.",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        import json
        content = response.content[0].text
        # Clean up response if needed
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        exercise_data = json.loads(content.strip())
        
        exercise = {
            "exercise_id": f"ex_{uuid.uuid4().hex[:12]}",
            "child_id": child_id,
            "subject": subject,
            "skill_ids": [skill_info["skill_id"]],
            "question": exercise_data["question"],
            "correct_answer": exercise_data["correct_answer"],
            "options": exercise_data.get("options", []),
            "hints": [exercise_data.get("hint1", ""), exercise_data.get("hint2", "")],
            "difficulty": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.exercises.insert_one(exercise)
        exercise.pop("_id", None)
        return exercise
        
    except Exception as e:
        logger.error(f"Error generating exercise: {e}")
        # Return a fallback exercise from predefined bank
        import random
        fallback = get_fallback_exercise(subject, skill_info, child_id)
        await db.exercises.insert_one(fallback)
        fallback.pop("_id", None)
        return fallback

# Predefined exercise bank
EXERCISE_BANK = {
    "matematicas": [
        {"question": "¿Cuánto es 7 + 5?", "correct_answer": "12", "options": ["10", "11", "12", "13"], "hints": ["Cuenta desde 7", "7, 8, 9, 10, 11..."]},
        {"question": "¿Cuánto es 9 + 4?", "correct_answer": "13", "options": ["12", "13", "14", "15"], "hints": ["Puedes usar los dedos", "9 + 1 = 10, luego suma 3 más"]},
        {"question": "¿Cuánto es 15 - 8?", "correct_answer": "7", "options": ["5", "6", "7", "8"], "hints": ["Cuenta hacia atrás desde 15", "15, 14, 13..."]},
        {"question": "¿Cuánto es 6 × 3?", "correct_answer": "18", "options": ["15", "16", "18", "21"], "hints": ["6 + 6 + 6", "Piensa en 3 grupos de 6"]},
        {"question": "¿Cuánto es 4 × 5?", "correct_answer": "20", "options": ["15", "18", "20", "25"], "hints": ["5 + 5 + 5 + 5", "Cuenta de 5 en 5"]},
        {"question": "¿Cuánto es 24 ÷ 6?", "correct_answer": "4", "options": ["3", "4", "5", "6"], "hints": ["¿Cuántas veces cabe 6 en 24?", "6 × ? = 24"]},
        {"question": "¿Cuánto es 8 + 7?", "correct_answer": "15", "options": ["13", "14", "15", "16"], "hints": ["8 + 2 = 10, luego suma 5", "Usa los dedos"]},
        {"question": "¿Qué número es mayor: 45 o 54?", "correct_answer": "54", "options": ["45", "54"], "hints": ["Mira las decenas primero", "5 decenas > 4 decenas"]},
        {"question": "¿Cuánto es 100 - 35?", "correct_answer": "65", "options": ["55", "65", "75", "45"], "hints": ["100 - 30 = 70, luego resta 5", "Piensa en monedas"]},
        {"question": "¿Cuánto es la mitad de 16?", "correct_answer": "8", "options": ["6", "7", "8", "9"], "hints": ["Divide 16 entre 2", "8 + 8 = 16"]},
    ],
    "lengua": [
        {"question": "¿Cuál es el artículo correcto? ___ casa", "correct_answer": "La", "options": ["El", "La", "Los", "Las"], "hints": ["Casa es femenino", "Termina en -a"]},
        {"question": "¿Cuál palabra está bien escrita?", "correct_answer": "Había", "options": ["Avia", "Havia", "Había", "Abia"], "hints": ["Lleva H al inicio", "También lleva tilde"]},
        {"question": "¿Qué tipo de palabra es 'rápidamente'?", "correct_answer": "Adverbio", "options": ["Sustantivo", "Adjetivo", "Verbo", "Adverbio"], "hints": ["Describe cómo se hace algo", "Termina en -mente"]},
        {"question": "¿Cuál es el plural de 'lápiz'?", "correct_answer": "Lápices", "options": ["Lápizes", "Lápices", "Lápicess", "Lápiz"], "hints": ["La z cambia a c", "Se añade -es"]},
        {"question": "¿Qué signo va al final de una pregunta?", "correct_answer": "?", "options": [".", "!", "?", ","], "hints": ["Es el signo de interrogación", "Se usa para preguntar"]},
        {"question": "¿Cuál palabra es un sustantivo?", "correct_answer": "Perro", "options": ["Correr", "Bonito", "Perro", "Rápido"], "hints": ["Es el nombre de algo", "Puedes tocarlo o verlo"]},
        {"question": "¿Cómo se escribe correctamente?", "correct_answer": "Vaca", "options": ["Baca", "Vaca", "Bacca", "Vacca"], "hints": ["El animal se escribe con V", "Vaca da leche"]},
        {"question": "¿Cuál es el sinónimo de 'grande'?", "correct_answer": "Enorme", "options": ["Pequeño", "Enorme", "Bajo", "Corto"], "hints": ["Significa lo mismo", "También indica tamaño alto"]},
    ],
    "ciencias": [
        {"question": "¿Qué planeta está más cerca del Sol?", "correct_answer": "Mercurio", "options": ["Venus", "Mercurio", "Tierra", "Marte"], "hints": ["Es el más pequeño también", "Su nombre empieza por M"]},
        {"question": "¿Cuántas patas tiene una araña?", "correct_answer": "8", "options": ["6", "8", "10", "4"], "hints": ["Más que un insecto", "Los insectos tienen 6"]},
        {"question": "¿Qué parte de la planta absorbe agua?", "correct_answer": "Raíz", "options": ["Hoja", "Tallo", "Raíz", "Flor"], "hints": ["Está bajo tierra", "No la vemos normalmente"]},
        {"question": "¿Cuál es el estado líquido del agua?", "correct_answer": "Agua", "options": ["Hielo", "Agua", "Vapor", "Nieve"], "hints": ["La puedes beber", "No es sólido ni gas"]},
        {"question": "¿Qué órgano bombea la sangre?", "correct_answer": "Corazón", "options": ["Pulmones", "Cerebro", "Corazón", "Estómago"], "hints": ["Late todo el tiempo", "Está en el pecho"]},
        {"question": "¿Qué necesitan las plantas para vivir?", "correct_answer": "Luz solar", "options": ["Oscuridad", "Luz solar", "Arena", "Sal"], "hints": ["Viene del sol", "La fotosíntesis lo necesita"]},
    ],
    "ingles": [
        {"question": "How do you say 'rojo' in English?", "correct_answer": "Red", "options": ["Blue", "Red", "Green", "Yellow"], "hints": ["Es el color de las fresas", "Empieza por R"]},
        {"question": "What is 'perro' in English?", "correct_answer": "Dog", "options": ["Cat", "Dog", "Bird", "Fish"], "hints": ["Says 'woof woof'", "Man's best friend"]},
        {"question": "How many days are in a week?", "correct_answer": "Seven", "options": ["Five", "Six", "Seven", "Eight"], "hints": ["Monday to Sunday", "Cuenta los días"]},
        {"question": "What color is the sky?", "correct_answer": "Blue", "options": ["Red", "Green", "Blue", "Yellow"], "hints": ["Mira arriba en un día soleado", "El mar también es de ese color"]},
        {"question": "How do you say 'gracias' in English?", "correct_answer": "Thank you", "options": ["Please", "Sorry", "Thank you", "Hello"], "hints": ["Lo dices cuando te dan algo", "Es de buena educación"]},
        {"question": "What is 'madre' in English?", "correct_answer": "Mother", "options": ["Father", "Mother", "Sister", "Brother"], "hints": ["Es tu mamá", "También se dice 'Mom'"]},
    ]
}

def get_fallback_exercise(subject: str, skill_info: dict, child_id: str) -> dict:
    """Get a random exercise from the predefined bank"""
    import random
    exercises = EXERCISE_BANK.get(subject, EXERCISE_BANK["matematicas"])
    exercise_template = random.choice(exercises)
    
    return {
        "exercise_id": f"ex_{uuid.uuid4().hex[:12]}",
        "child_id": child_id,
        "subject": subject,
        "skill_ids": [skill_info["skill_id"]],
        "question": exercise_template["question"],
        "correct_answer": exercise_template["correct_answer"],
        "options": exercise_template["options"],
        "hints": exercise_template["hints"],
        "difficulty": 1,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

@api_router.post("/attempts")
async def record_attempt(
    attempt_data: AttemptCreate,
    user: User = Depends(get_current_user)
):
    """Record an attempt at an exercise"""
    exercise = await db.exercises.find_one({"exercise_id": attempt_data.exercise_id}, {"_id": 0})
    if not exercise:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    
    # Verify child belongs to user
    child = await db.children.find_one({"child_id": exercise["child_id"], "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    is_correct = attempt_data.answer_given.strip().lower() == exercise["correct_answer"].strip().lower()
    
    attempt = {
        "attempt_id": f"att_{uuid.uuid4().hex[:12]}",
        "child_id": exercise["child_id"],
        "exercise_id": attempt_data.exercise_id,
        "skill_ids": exercise["skill_ids"],
        "subject": exercise["subject"],
        "is_correct": is_correct,
        "answer_given": attempt_data.answer_given,
        "hints_used": attempt_data.hints_used,
        "time_seconds": attempt_data.time_seconds,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.attempts.insert_one(attempt)
    
    # Update skill progress
    for skill_id in exercise["skill_ids"]:
        await db.skill_progress.update_one(
            {"child_id": exercise["child_id"], "skill_id": skill_id},
            {
                "$inc": {
                    "total_attempts": 1,
                    "correct_attempts": 1 if is_correct else 0,
                    "hints_total": attempt_data.hints_used
                },
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            },
            upsert=True
        )
    
    return {
        "is_correct": is_correct,
        "correct_answer": exercise["correct_answer"] if not is_correct else None,
        "message": "¡Muy bien! 🎉" if is_correct else "No pasa nada, ¡inténtalo de nuevo!"
    }

# ============== CHAT WITH TUTOR ==============

@api_router.post("/chat/{child_id}")
async def chat_with_tutor(
    child_id: str,
    chat_request: ChatRequest,
    user: User = Depends(get_current_user)
):
    """Chat with the AI tutor"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    # Get recent chat history
    recent_messages = await db.chat_messages.find(
        {"child_id": child_id}
    ).sort("created_at", -1).limit(10).to_list(10)
    recent_messages.reverse()
    
    # Build messages for Claude
    system_message = f"""Eres un tutor amable y paciente para {child['name']}, un niño de {child['age']} años en {child['grade']}º de primaria en España.

REGLAS IMPORTANTES:
1. Usa lenguaje simple y apropiado para su edad
2. Sé muy positivo y alentador
3. Nunca des la respuesta directa - guía con preguntas
4. Si se equivoca, anímalo a intentarlo de nuevo
5. Usa ejemplos cotidianos y analogías simples
6. Celebra los esfuerzos, no solo los resultados
7. Si detectas frustración, baja la dificultad
8. Responde SIEMPRE en español

Contexto actual: {chat_request.context or 'conversación general'}"""

    # Claude expects messages without system role in the array
    messages = []
    
    for msg in recent_messages:
        messages.append({"role": msg["role"], "content": msg["content"]})
    
    messages.append({"role": "user", "content": chat_request.message})
    
    try:
        response = await claude_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            system=system_message,
            messages=messages
        )
        
        assistant_message = response.content[0].text
        
        # Save messages to database
        user_msg = {
            "message_id": f"msg_{uuid.uuid4().hex[:12]}",
            "child_id": child_id,
            "role": "user",
            "content": chat_request.message,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        assistant_msg = {
            "message_id": f"msg_{uuid.uuid4().hex[:12]}",
            "child_id": child_id,
            "role": "assistant",
            "content": assistant_message,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.chat_messages.insert_many([user_msg, assistant_msg])
        
        return {"message": assistant_message}
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        # Fallback responses based on message content
        fallback_response = get_fallback_chat_response(chat_request.message, child['name'])
        
        # Save messages even with fallback
        user_msg = {
            "message_id": f"msg_{uuid.uuid4().hex[:12]}",
            "child_id": child_id,
            "role": "user",
            "content": chat_request.message,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        assistant_msg = {
            "message_id": f"msg_{uuid.uuid4().hex[:12]}",
            "child_id": child_id,
            "role": "assistant",
            "content": fallback_response,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_many([user_msg, assistant_msg])
        
        return {"message": fallback_response}

def get_fallback_chat_response(message: str, child_name: str) -> str:
    """Get a helpful fallback response based on keywords in the message"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["suma", "sumar", "más", "+"]):
        return f"¡Buena pregunta, {child_name}! Para sumar, piensa en juntar cosas. Por ejemplo, si tienes 3 manzanas y te dan 2 más, ¿cuántas tendrás en total? Cuenta con los dedos si te ayuda. 🍎"
    
    elif any(word in message_lower for word in ["resta", "restar", "menos", "-", "quitar"]):
        return f"¡Vamos a restar, {child_name}! Restar es como quitar. Si tienes 5 caramelos y te comes 2, ¿cuántos te quedan? Prueba a contar hacia atrás. 🍬"
    
    elif any(word in message_lower for word in ["multiplica", "multiplicar", "por", "×", "veces"]):
        return f"¡Las multiplicaciones son sumas repetidas, {child_name}! Por ejemplo, 3 × 4 es lo mismo que sumar 3 cuatro veces: 3+3+3+3. ¿Quieres que practiquemos juntos? ✨"
    
    elif any(word in message_lower for word in ["divide", "dividir", "entre", "÷", "repartir"]):
        return f"Dividir es como repartir en partes iguales, {child_name}. Si tienes 12 galletas para 4 amigos, ¿cuántas le tocan a cada uno? Piensa en repartir una a una. 🍪"
    
    elif any(word in message_lower for word in ["fracción", "fracciones", "mitad", "cuarto"]):
        return f"¡Las fracciones son partes de un todo, {child_name}! Imagina una pizza cortada en trozos iguales. Si comes 1 de 4 trozos, has comido 1/4 de la pizza. 🍕"
    
    elif any(word in message_lower for word in ["verbo", "verbos", "acción"]):
        return f"¡Los verbos son palabras de acción, {child_name}! Correr, saltar, comer, dormir... ¿Qué estás haciendo ahora mismo? ¡Eso es un verbo! 🏃"
    
    elif any(word in message_lower for word in ["sustantivo", "nombre", "cosa"]):
        return f"Los sustantivos son los nombres de todo lo que existe, {child_name}. Pueden ser personas (mamá), animales (perro), cosas (mesa) o lugares (parque). ¿Puedes decirme 3 sustantivos? 📝"
    
    elif any(word in message_lower for word in ["adjetivo", "describe", "cualidad"]):
        return f"¡Los adjetivos describen cómo son las cosas, {child_name}! Grande, pequeño, rojo, suave... Por ejemplo: el gato NEGRO. 'Negro' es el adjetivo. 🎨"
    
    elif any(word in message_lower for word in ["ortografía", "escribir", "letra"]):
        return f"¡La ortografía es importante, {child_name}! Un truco: lee mucho, así tu cerebro aprende cómo se ven las palabras correctas. ¿Hay alguna palabra que te cueste? 📖"
    
    elif any(word in message_lower for word in ["planeta", "sol", "luna", "tierra"]):
        return f"¡El espacio es fascinante, {child_name}! Hay 8 planetas en nuestro sistema solar. La Tierra es el tercero desde el Sol y es el único donde hay vida como la conocemos. 🌍"
    
    elif any(word in message_lower for word in ["animal", "animales", "perro", "gato"]):
        return f"¡Los animales son increíbles, {child_name}! Hay mamíferos, aves, peces, reptiles y anfibios. ¿Cuál es tu animal favorito? Puedo contarte curiosidades sobre él. 🦁"
    
    elif any(word in message_lower for word in ["planta", "plantas", "árbol", "flor"]):
        return f"Las plantas son seres vivos muy especiales, {child_name}. Necesitan agua, luz del sol y tierra para crecer. ¡Y nos dan el oxígeno que respiramos! 🌱"
    
    elif any(word in message_lower for word in ["inglés", "english", "traducir"]):
        return f"¡Let's learn English, {child_name}! El inglés es muy útil. Empecemos con palabras simples: Hello = Hola, Goodbye = Adiós, Thank you = Gracias. 🌍"
    
    elif any(word in message_lower for word in ["ayuda", "no entiendo", "difícil", "no sé"]):
        return f"¡No te preocupes, {child_name}! Todos aprendemos paso a paso. Dime qué parte no entiendes y lo explicamos juntos. No hay preguntas tontas, ¿vale? 💪"
    
    elif any(word in message_lower for word in ["hola", "buenos días", "buenas"]):
        return f"¡Hola, {child_name}! 👋 ¿Qué tal estás? Estoy aquí para ayudarte con lo que necesites. ¿Qué te gustaría aprender hoy?"
    
    else:
        return f"¡Buena pregunta, {child_name}! 🌟 Déjame pensar cómo explicártelo mejor. ¿Puedes darme más detalles sobre lo que necesitas? Así podré ayudarte mejor."

@api_router.get("/chat/{child_id}/history")
async def get_chat_history(
    child_id: str,
    limit: int = 50,
    user: User = Depends(get_current_user)
):
    """Get chat history for a child"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    messages = await db.chat_messages.find(
        {"child_id": child_id}, {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    messages.reverse()
    return messages

# ============== DAILY CHECK-IN ==============

@api_router.post("/checkin/{child_id}")
async def create_checkin(
    child_id: str,
    checkin: CheckInCreate,
    user: User = Depends(get_current_user)
):
    """Record daily check-in"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    checkin_doc = {
        "checkin_id": f"chk_{uuid.uuid4().hex[:12]}",
        "child_id": child_id,
        "mood": checkin.mood,
        "energy": checkin.energy,
        "note": checkin.note,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.checkins.insert_one(checkin_doc)
    checkin_doc.pop("_id", None)
    return checkin_doc

@api_router.get("/checkin/{child_id}/today")
async def get_today_checkin(
    child_id: str,
    user: User = Depends(get_current_user)
):
    """Get today's check-in"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    checkin = await db.checkins.find_one(
        {"child_id": child_id, "created_at": {"$gte": today_start.isoformat()}},
        {"_id": 0}
    )
    return checkin

# ============== PROGRESS & REPORTS ==============

@api_router.get("/progress/{child_id}")
async def get_progress(
    child_id: str,
    user: User = Depends(get_current_user)
):
    """Get progress summary for a child"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    # Get skill progress
    skill_progress = await db.skill_progress.find({"child_id": child_id}, {"_id": 0}).to_list(100)
    
    # Calculate subject summaries
    subjects = {}
    for subject, skills in SKILLS_DATA.items():
        subject_skills = []
        total_correct = 0
        total_attempts = 0
        
        for skill in skills:
            if skill["grade_level"] > child["grade"]:
                continue
                
            progress = next((p for p in skill_progress if p["skill_id"] == skill["skill_id"]), None)
            if progress:
                accuracy = (progress["correct_attempts"] / progress["total_attempts"] * 100) if progress["total_attempts"] > 0 else 0
                subject_skills.append({
                    **skill,
                    "accuracy": round(accuracy),
                    "attempts": progress["total_attempts"],
                    "needs_practice": accuracy < 70
                })
                total_correct += progress["correct_attempts"]
                total_attempts += progress["total_attempts"]
            else:
                subject_skills.append({
                    **skill,
                    "accuracy": 0,
                    "attempts": 0,
                    "needs_practice": True
                })
        
        overall_accuracy = (total_correct / total_attempts * 100) if total_attempts > 0 else 0
        status = "green" if overall_accuracy >= 70 else ("yellow" if overall_accuracy >= 50 else "red")
        
        subjects[subject] = {
            "name": subject.capitalize(),
            "status": status,
            "accuracy": round(overall_accuracy),
            "total_attempts": total_attempts,
            "skills": subject_skills,
            "skills_to_practice": [s for s in subject_skills if s.get("needs_practice")][:3]
        }
    
    # Get recent attempts for streak calculation
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    recent_attempts = await db.attempts.find({
        "child_id": child_id,
        "created_at": {"$gte": week_ago.isoformat()}
    }, {"_id": 0}).to_list(1000)
    
    # Calculate streak
    practice_days = set()
    for attempt in recent_attempts:
        date = attempt["created_at"][:10]
        practice_days.add(date)
    
    return {
        "child": child,
        "subjects": subjects,
        "weekly_stats": {
            "total_exercises": len(recent_attempts),
            "correct_exercises": len([a for a in recent_attempts if a["is_correct"]]),
            "practice_days": len(practice_days),
            "streak": len(practice_days)
        }
    }

@api_router.get("/report/{child_id}/weekly")
async def get_weekly_report(
    child_id: str,
    user: User = Depends(get_current_user)
):
    """Get weekly report for parents"""
    child = await db.children.find_one({"child_id": child_id, "parent_id": user.user_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    
    # Get attempts
    attempts = await db.attempts.find({
        "child_id": child_id,
        "created_at": {"$gte": week_ago.isoformat()}
    }, {"_id": 0}).to_list(1000)
    
    # Get check-ins
    checkins = await db.checkins.find({
        "child_id": child_id,
        "created_at": {"$gte": week_ago.isoformat()}
    }, {"_id": 0}).to_list(7)
    
    # Calculate stats by subject
    subject_stats = {}
    for subject in SKILLS_DATA.keys():
        subj_attempts = [a for a in attempts if a["subject"] == subject]
        correct = len([a for a in subj_attempts if a["is_correct"]])
        total = len(subj_attempts)
        accuracy = (correct / total * 100) if total > 0 else 0
        
        subject_stats[subject] = {
            "total": total,
            "correct": correct,
            "accuracy": round(accuracy),
            "status": "green" if accuracy >= 70 else ("yellow" if accuracy >= 50 else "red")
        }
    
    # Get skills that need attention
    skill_progress = await db.skill_progress.find({"child_id": child_id}, {"_id": 0}).to_list(100)
    skills_to_improve = []
    
    for progress in skill_progress:
        if progress["total_attempts"] > 0:
            accuracy = progress["correct_attempts"] / progress["total_attempts"] * 100
            if accuracy < 70:
                # Find skill name
                for subject, skills in SKILLS_DATA.items():
                    for skill in skills:
                        if skill["skill_id"] == progress["skill_id"]:
                            skills_to_improve.append({
                                "skill_id": progress["skill_id"],
                                "name": skill["name"],
                                "subject": subject,
                                "accuracy": round(accuracy)
                            })
                            break
    
    skills_to_improve.sort(key=lambda x: x["accuracy"])
    
    # Generate recommendation
    total_correct = sum(s["correct"] for s in subject_stats.values())
    total_attempts = sum(s["total"] for s in subject_stats.values())
    
    if total_attempts == 0:
        recommendation = f"{child['name']} no ha practicado esta semana. Te recomendamos empezar con sesiones cortas de 5-10 minutos."
    elif total_correct / total_attempts >= 0.7:
        recommendation = f"¡{child['name']} lo está haciendo muy bien! Mantened el ritmo con sesiones de 10 minutos."
    else:
        weak_subject = min(subject_stats.items(), key=lambda x: x[1]["accuracy"] if x[1]["total"] > 0 else 100)
        recommendation = f"Recomendamos practicar más {weak_subject[0]} con 3 sesiones cortas de 8 minutos esta semana."
    
    # Calculate mood average
    avg_energy = sum(c["energy"] for c in checkins) / len(checkins) if checkins else 0
    mood_summary = "positivo" if avg_energy >= 3.5 else ("neutral" if avg_energy >= 2.5 else "bajo")
    
    return {
        "child": child,
        "period": {
            "start": week_ago.isoformat(),
            "end": datetime.now(timezone.utc).isoformat()
        },
        "summary": {
            "total_exercises": total_attempts,
            "correct_exercises": total_correct,
            "accuracy": round((total_correct / total_attempts * 100) if total_attempts > 0 else 0),
            "practice_days": len(set(a["created_at"][:10] for a in attempts))
        },
        "subjects": subject_stats,
        "skills_to_improve": skills_to_improve[:3],
        "recommendation": recommendation,
        "mood_summary": mood_summary,
        "checkins": checkins
    }

# ============== ROOT ENDPOINT ==============

@api_router.get("/")
async def root():
    return {"message": "TutorIA API - Tu tutor personal de primaria"}

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
