const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');
const { getCurrentUser } = require('../middleware/auth');

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Fallback responses based on keywords
function getFallbackChatResponse(message, childName) {
  const messageLower = message.toLowerCase();

  if (['suma', 'sumar', 'más', '+'].some(word => messageLower.includes(word))) {
    return `¡Buena pregunta, ${childName}! Para sumar, piensa en juntar cosas. Por ejemplo, si tienes 3 manzanas y te dan 2 más, ¿cuántas tendrás en total? Cuenta con los dedos si te ayuda. 🍎`;
  }

  if (['resta', 'restar', 'menos', '-', 'quitar'].some(word => messageLower.includes(word))) {
    return `¡Vamos a restar, ${childName}! Restar es como quitar. Si tienes 5 caramelos y te comes 2, ¿cuántos te quedan? Prueba a contar hacia atrás. 🍬`;
  }

  if (['multiplica', 'multiplicar', 'por', '×', 'veces'].some(word => messageLower.includes(word))) {
    return `¡Las multiplicaciones son sumas repetidas, ${childName}! Por ejemplo, 3 × 4 es lo mismo que sumar 3 cuatro veces: 3+3+3+3. ¿Quieres que practiquemos juntos? ✨`;
  }

  if (['divide', 'dividir', 'entre', '÷', 'repartir'].some(word => messageLower.includes(word))) {
    return `Dividir es como repartir en partes iguales, ${childName}. Si tienes 12 galletas para 4 amigos, ¿cuántas le tocan a cada uno? Piensa en repartir una a una. 🍪`;
  }

  if (['fracción', 'fracciones', 'mitad', 'cuarto'].some(word => messageLower.includes(word))) {
    return `¡Las fracciones son partes de un todo, ${childName}! Imagina una pizza cortada en trozos iguales. Si comes 1 de 4 trozos, has comido 1/4 de la pizza. 🍕`;
  }

  if (['verbo', 'verbos', 'acción'].some(word => messageLower.includes(word))) {
    return `¡Los verbos son palabras de acción, ${childName}! Correr, saltar, comer, dormir... ¿Qué estás haciendo ahora mismo? ¡Eso es un verbo! 🏃`;
  }

  if (['sustantivo', 'nombre', 'cosa'].some(word => messageLower.includes(word))) {
    return `Los sustantivos son los nombres de todo lo que existe, ${childName}. Pueden ser personas (mamá), animales (perro), cosas (mesa) o lugares (parque). ¿Puedes decirme 3 sustantivos? 📝`;
  }

  if (['adjetivo', 'describe', 'cualidad'].some(word => messageLower.includes(word))) {
    return `¡Los adjetivos describen cómo son las cosas, ${childName}! Grande, pequeño, rojo, suave... Por ejemplo: el gato NEGRO. 'Negro' es el adjetivo. 🎨`;
  }

  if (['ortografía', 'escribir', 'letra'].some(word => messageLower.includes(word))) {
    return `¡La ortografía es importante, ${childName}! Un truco: lee mucho, así tu cerebro aprende cómo se ven las palabras correctas. ¿Hay alguna palabra que te cueste? 📖`;
  }

  if (['planeta', 'sol', 'luna', 'tierra'].some(word => messageLower.includes(word))) {
    return `¡El espacio es fascinante, ${childName}! Hay 8 planetas en nuestro sistema solar. La Tierra es el tercero desde el Sol y es el único donde hay vida como la conocemos. 🌍`;
  }

  if (['animal', 'animales', 'perro', 'gato'].some(word => messageLower.includes(word))) {
    return `¡Los animales son increíbles, ${childName}! Hay mamíferos, aves, peces, reptiles y anfibios. ¿Cuál es tu animal favorito? Puedo contarte curiosidades sobre él. 🦁`;
  }

  if (['planta', 'plantas', 'árbol', 'flor'].some(word => messageLower.includes(word))) {
    return `Las plantas son seres vivos muy especiales, ${childName}. Necesitan agua, luz del sol y tierra para crecer. ¡Y nos dan el oxígeno que respiramos! 🌱`;
  }

  if (['inglés', 'english', 'traducir'].some(word => messageLower.includes(word))) {
    return `¡Let's learn English, ${childName}! El inglés es muy útil. Empecemos con palabras simples: Hello = Hola, Goodbye = Adiós, Thank you = Gracias. 🌍`;
  }

  if (['ayuda', 'no entiendo', 'difícil', 'no sé'].some(word => messageLower.includes(word))) {
    return `¡No te preocupes, ${childName}! Todos aprendemos paso a paso. Dime qué parte no entiendes y lo explicamos juntos. No hay preguntas tontas, ¿vale? 💪`;
  }

  if (['hola', 'buenos días', 'buenas'].some(word => messageLower.includes(word))) {
    return `¡Hola, ${childName}! 👋 ¿Qué tal estás? Estoy aquí para ayudarte con lo que necesites. ¿Qué te gustaría aprender hoy?`;
  }

  // Short reactions / confusion signals → push forward, never ask kid to explain
  if (messageLower.length < 5 || ['?', 'y?', 'no se', 'no sé', 'mas', 'más', 'sigue', 'vale', 'ok'].includes(messageLower.trim())) {
    return `¡Vamos con otro ejemplo, ${childName}! 🌟 Imagina que tienes 8 cromos y los repartes entre 2 amigos. ¿Cuántos le tocan a cada uno? Piensa en repartir uno a uno.`;
  }

  return `¡Mira, ${childName}! 🌟 Te lo cuento con un ejemplo: imagina una tarta dividida en 4 trozos y te comes 1. ¿Cuánto te queda? ¿Quieres que probemos uno juntos?`;
}

// Chat with the AI tutor
router.post('/:child_id', getCurrentUser, async (req, res) => {
  try {
    const { child_id } = req.params;
    const { message, context } = req.body;
    const db = req.app.locals.db;

    // Verify child belongs to user
    const child = await db.collection('children').findOne({
      child_id,
      parent_id: req.user.user_id
    });

    if (!child) {
      return res.status(404).json({ detail: 'Niño no encontrado' });
    }

    // Get recent chat history (last 10 messages)
    const recentMessages = await db.collection('chat_messages')
      .find({ child_id })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();

    recentMessages.reverse();

    // Build messages for Claude
    const systemMessage = `Eres el tutor personal de ${child.name}, un niño/a de ${child.age} años en ${child.grade}º de primaria en España (curriculo LOMLOE).

TU ROL: Eres un maestro proactivo, no un asistente pasivo. Llevas tu la iniciativa de la conversacion.

COMO ENSENAR (sigue siempre estos pasos):
1. Explica con UN ejemplo concreto y cotidiano (pizza, caramelos, juguetes, animales).
2. Despues del ejemplo, comprueba comprension con UNA pregunta sencilla y cerrada ("¿lo ves?" "¿quieres que te ponga otro ejemplo?" "¿probamos uno facil?").
3. Si el nino responde corto ("si", "no", "y?", "?", "vale", "no se", "mas", solo emojis, una palabra) → NO le pidas que se explique. Eso lo bloquea. En su lugar:
   - Avanza tu mismo con OTRO ejemplo, mas simple aun.
   - O proponle un mini-reto: "te pongo uno facil: ¿cuanto es 1/2 de 4 manzanas?"
   - O ofrece 2 caminos: "¿quieres que te lo cuente con dibujos imaginarios o con numeros?"
4. Si detectas frustracion (mensajes negativos, "no puedo", "es dificil") → valida ("es normal, a mi tambien me costo"), baja la dificultad y vuelve a empezar con algo que SI sepa.
5. Celebra cada intento, incluso los equivocados ("¡buen intento! casi, mira...").
6. Cada 3-4 mensajes haz una pequena pausa: "¡vas muy bien! ¿seguimos con esto o quieres ver otra cosa?"

REGLAS DE ESTILO:
- Frases cortas (max 2-3 lineas por mensaje).
- Lenguaje de ${child.age} anos: tu, sin tecnicismos, con emojis ocasionales (1 max por mensaje).
- Nunca digas "dame mas detalles" ni "explicame mejor" — el nino no sabe explicarse, eres tu quien guia.
- Nunca des la respuesta de un ejercicio escolar directamente; guia paso a paso.
- Responde SIEMPRE en espanol de Espana.

Contexto actual: ${context || 'conversacion general'}`;

    // Build messages array for Claude
    const messages = recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    messages.push({
      role: 'user',
      content: message
    });

    // Try to get response from Claude
    let assistantMessage;
    try {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemMessage,
        messages
      });

      assistantMessage = response.content[0].text;
    } catch (claudeError) {
      console.error('Claude API error:', claudeError);
      // Use fallback response
      assistantMessage = getFallbackChatResponse(message, child.name);
    }

    // Save both messages to database
    const userMsg = {
      message_id: `msg_${uuidv4().toString().replace(/-/g, '').substring(0, 12)}`,
      child_id,
      role: 'user',
      content: message,
      created_at: new Date().toISOString()
    };

    const assistantMsg = {
      message_id: `msg_${uuidv4().toString().replace(/-/g, '').substring(0, 12)}`,
      child_id,
      role: 'assistant',
      content: assistantMessage,
      created_at: new Date().toISOString()
    };

    await db.collection('chat_messages').insertMany([userMsg, assistantMsg]);

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ detail: 'Error al procesar mensaje' });
  }
});

// Get chat history for a child
router.get('/:child_id/history', getCurrentUser, async (req, res) => {
  try {
    const { child_id } = req.params;
    const { limit = 50 } = req.query;
    const db = req.app.locals.db;

    // Verify child belongs to user
    const child = await db.collection('children').findOne({
      child_id,
      parent_id: req.user.user_id
    });

    if (!child) {
      return res.status(404).json({ detail: 'Niño no encontrado' });
    }

    // Get messages
    const messages = await db.collection('chat_messages')
      .find({ child_id })
      .project({ _id: 0 })
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .toArray();

    messages.reverse();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ detail: 'Error al obtener historial' });
  }
});

module.exports = router;
