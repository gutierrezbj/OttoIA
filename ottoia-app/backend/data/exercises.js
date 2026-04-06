// Exercise bank exported as module
const EXERCISE_BANK = {
  matematicas: [
    { question: "¿Cuánto es 7 + 5?", correct_answer: "12", options: ["10", "11", "12", "13"], hints: ["Cuenta desde 7", "7, 8, 9, 10, 11..."] },
    { question: "¿Cuánto es 9 + 4?", correct_answer: "13", options: ["12", "13", "14", "15"], hints: ["Puedes usar los dedos", "9 + 1 = 10, luego suma 3 más"] },
    { question: "¿Cuánto es 15 - 8?", correct_answer: "7", options: ["5", "6", "7", "8"], hints: ["Cuenta hacia atrás desde 15", "15, 14, 13..."] },
    { question: "¿Cuánto es 6 × 3?", correct_answer: "18", options: ["15", "16", "18", "21"], hints: ["6 + 6 + 6", "Piensa en 3 grupos de 6"] },
    { question: "¿Cuánto es 4 × 5?", correct_answer: "20", options: ["15", "18", "20", "25"], hints: ["5 + 5 + 5 + 5", "Cuenta de 5 en 5"] },
    { question: "¿Cuánto es 24 ÷ 6?", correct_answer: "4", options: ["3", "4", "5", "6"], hints: ["¿Cuántas veces cabe 6 en 24?", "6 × ? = 24"] },
    { question: "¿Cuánto es 8 + 7?", correct_answer: "15", options: ["13", "14", "15", "16"], hints: ["8 + 2 = 10, luego suma 5", "Usa los dedos"] },
    { question: "¿Qué número es mayor: 45 o 54?", correct_answer: "54", options: ["45", "54"], hints: ["Mira las decenas primero", "5 decenas > 4 decenas"] },
    { question: "¿Cuánto es 100 - 35?", correct_answer: "65", options: ["55", "65", "75", "45"], hints: ["100 - 30 = 70, luego resta 5", "Piensa en monedas"] },
    { question: "¿Cuánto es la mitad de 16?", correct_answer: "8", options: ["6", "7", "8", "9"], hints: ["Divide 16 entre 2", "8 + 8 = 16"] },
  ],
  lengua: [
    { question: "¿Cuál es el artículo correcto? ___ casa", correct_answer: "La", options: ["El", "La", "Los", "Las"], hints: ["Casa es femenino", "Termina en -a"] },
    { question: "¿Cuál palabra está bien escrita?", correct_answer: "Había", options: ["Avia", "Havia", "Había", "Abia"], hints: ["Lleva H al inicio", "También lleva tilde"] },
    { question: "¿Qué tipo de palabra es 'rápidamente'?", correct_answer: "Adverbio", options: ["Sustantivo", "Adjetivo", "Verbo", "Adverbio"], hints: ["Describe cómo se hace algo", "Termina en -mente"] },
    { question: "¿Cuál es el plural de 'lápiz'?", correct_answer: "Lápices", options: ["Lápizes", "Lápices", "Lápicess", "Lápiz"], hints: ["La z cambia a c", "Se añade -es"] },
    { question: "¿Qué signo va al final de una pregunta?", correct_answer: "?", options: [".", "!", "?", ","], hints: ["Es el signo de interrogación", "Se usa para preguntar"] },
    { question: "¿Cuál palabra es un sustantivo?", correct_answer: "Perro", options: ["Correr", "Bonito", "Perro", "Rápido"], hints: ["Es el nombre de algo", "Puedes tocarlo o verlo"] },
    { question: "¿Cómo se escribe correctamente?", correct_answer: "Vaca", options: ["Baca", "Vaca", "Bacca", "Vacca"], hints: ["El animal se escribe con V", "Vaca da leche"] },
    { question: "¿Cuál es el sinónimo de 'grande'?", correct_answer: "Enorme", options: ["Pequeño", "Enorme", "Bajo", "Corto"], hints: ["Significa lo mismo", "También indica tamaño alto"] },
  ],
  ciencias: [
    { question: "¿Qué planeta está más cerca del Sol?", correct_answer: "Mercurio", options: ["Venus", "Mercurio", "Tierra", "Marte"], hints: ["Es el más pequeño también", "Su nombre empieza por M"] },
    { question: "¿Cuántas patas tiene una araña?", correct_answer: "8", options: ["6", "8", "10", "4"], hints: ["Más que un insecto", "Los insectos tienen 6"] },
    { question: "¿Qué parte de la planta absorbe agua?", correct_answer: "Raíz", options: ["Hoja", "Tallo", "Raíz", "Flor"], hints: ["Está bajo tierra", "No la vemos normalmente"] },
    { question: "¿Cuál es el estado líquido del agua?", correct_answer: "Agua", options: ["Hielo", "Agua", "Vapor", "Nieve"], hints: ["La puedes beber", "No es sólido ni gas"] },
    { question: "¿Qué órgano bombea la sangre?", correct_answer: "Corazón", options: ["Pulmones", "Cerebro", "Corazón", "Estómago"], hints: ["Late todo el tiempo", "Está en el pecho"] },
    { question: "¿Qué necesitan las plantas para vivir?", correct_answer: "Luz solar", options: ["Oscuridad", "Luz solar", "Arena", "Sal"], hints: ["Viene del sol", "La fotosíntesis lo necesita"] },
  ],
  ingles: [
    { question: "How do you say 'rojo' in English?", correct_answer: "Red", options: ["Blue", "Red", "Green", "Yellow"], hints: ["Es el color de las fresas", "Empieza por R"] },
    { question: "What is 'perro' in English?", correct_answer: "Dog", options: ["Cat", "Dog", "Bird", "Fish"], hints: ["Says 'woof woof'", "Man's best friend"] },
    { question: "How many days are in a week?", correct_answer: "Seven", options: ["Five", "Six", "Seven", "Eight"], hints: ["Monday to Sunday", "Cuenta los días"] },
    { question: "What color is the sky?", correct_answer: "Blue", options: ["Red", "Green", "Blue", "Yellow"], hints: ["Mira arriba en un día soleado", "El mar también es de ese color"] },
    { question: "How do you say 'gracias' in English?", correct_answer: "Thank you", options: ["Please", "Sorry", "Thank you", "Hello"], hints: ["Lo dices cuando te dan algo", "Es de buena educación"] },
    { question: "What is 'madre' in English?", correct_answer: "Mother", options: ["Father", "Mother", "Sister", "Brother"], hints: ["Es tu mamá", "También se dice 'Mom'"] },
  ]
};

module.exports = EXERCISE_BANK;
