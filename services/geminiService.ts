
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion } from '../types';
import { getQuestionHistory, addToQuestionHistory } from './localStorage';

interface KnowledgeBase {
  subjects: {
    science: {
      topics: string[];
      content: {
        [topic: string]: {
          facts: string[];
          vocabulary: string[];
          concepts: string[];
        };
      };
    };
  };
}

let knowledgeBase: KnowledgeBase | null = null;

const loadKnowledgeBase = async (): Promise<KnowledgeBase> => {
  if (!knowledgeBase) {
    const response = await fetch('/knowledge-base.json');
    knowledgeBase = await response.json();
  }
  return knowledgeBase!;
};

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_API_KEY });

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of 5 multiple-choice quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The question text.",
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: {
                            type: Type.STRING,
                        },
                    },
                    correctAnswer: {
                        type: Type.STRING,
                        description: "The correct answer, which must be one of the strings from the 'options' array.",
                    },
                },
                required: ["question", "options", "correctAnswer"],
            },
        },
    },
    required: ["questions"],
};


const getRandomSubset = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getQuestionTypes = () => {
  const types = [
    'Wat is die definisie van',
    'Watter van die volgende is waar oor',
    'Gee n voorbeeld van',
    'Wat gebeur wanneer',
    'Watter eienskap beskryf',
    'Hoekom is',
    'Watter proses',
    'Wat is die verskil tussen'
  ];
  return types[Math.floor(Math.random() * types.length)];
};

const getPromptVariation = (topic: string, difficulty: string, facts: string[], vocabulary: string[], concepts: string[], previousQuestions: string[]) => {
  const randomFacts = getRandomSubset(facts, 8);
  const randomVocab = getRandomSubset(vocabulary, 12);
  const randomConcepts = getRandomSubset(concepts, 4);
  const questionType = getQuestionTypes();
  
  const difficultyInstructions = {
    'Maklik': 'Gebruik eenvoudige taal en basiese konsepte. Fokus op definisies en eenvoudige feite.',
    'Gemiddeld': 'Gebruik meer detail en verlang begrip van konsepte. Sluit voorbeelde in.',
    'Moeilik': 'Verlang dieper begrip, verbande tussen konsepte, en toepassing van kennis.'
  };
  
  const avoidanceInstruction = previousQuestions.length > 0 
    ? `\n\nVERBELANGRIK: Moenie hierdie vorige vrae herhaal nie: ${previousQuestions.slice(-20).join('; ')}`
    : '';
  
  const variations = [
    `Skep 5 unieke verrassing-vrae oor ${topic} vir Graad 4 leerders in Afrikaans. Moeilikheidsgraad: ${difficulty}. ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]} Begin party vrae met "${questionType}". Maak elke vraag anders en interessant.`,
    
    `Genereer 5 uitdagende ${topic} vrae wat Graad 4 kinders sal opgewonde maak! Moeilikheidsgraad: ${difficulty}. Gebruik verskillende vraag-style: definisies, voorbeelde, vergelykings, oorsaak-en-gevolg. Wees kreatief!`,
    
    `Maak 5 boeiende vrae oor ${topic} wat leerders se nuuskierigheid sal prikkel. Moeilikheidsgraad: ${difficulty}. Sluit scenario-gebaseerde vrae in en vra hulle om na te dink oor alledaagse voorbeelde.`,
    
    `Skep 5 interaktiewe ${topic} vrae wat leerders sal uitdaag om verder te dink. Moeilikheidsgraad: ${difficulty}. Kombineer feite, konsepte en praktiese toepassings. Maak dit pret!`
  ];
  
  const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
  
  return `${selectedVariation}

Curriculum inhoud om te gebruik:
Feite: ${randomFacts.join('; ')}
Sleutelwoorde: ${randomVocab.join(', ')}
Konsepte: ${randomConcepts.join('; ')}

Elke vraag moet presies 4 opsies hê. Die 'correctAnswer' moet 'n presiese string-passing wees met een van die 'options' waardes.${avoidanceInstruction}`;
};

export const generateQuiz = async (topic: string, difficulty: string): Promise<QuizQuestion[]> => {
  try {
    const kb = await loadKnowledgeBase();
    const topicContent = kb.subjects.science.content[topic];
    
    if (!topicContent) {
      throw new Error(`No curriculum content found for topic: ${topic}`);
    }
    
    // Get previous questions to avoid repeats
    const previousQuestions = getQuestionHistory(topic);
    
    // Generate dynamic prompt
    const prompt = getPromptVariation(
      topic, 
      difficulty, 
      topicContent.facts, 
      topicContent.vocabulary, 
      topicContent.concepts,
      previousQuestions
    );

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: quizSchema,
            temperature: 1.0,  // Higher temperature for more creativity
            topP: 0.9,         // Add nucleus sampling for variety
            topK: 40           // Limit vocabulary for consistency
        },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Validate the structure
    if (parsedJson && Array.isArray(parsedJson.questions)) {
      const questions = parsedJson.questions as QuizQuestion[];
      
      // Store question texts to avoid future repeats
      const questionTexts = questions.map(q => q.question);
      addToQuestionHistory(topic, questionTexts);
      
      return questions;
    } else {
      console.error("Invalid JSON structure received from Gemini:", parsedJson);
      throw new Error("Failed to generate a valid quiz. The AI returned an unexpected format.");
    }
  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
    throw new Error("Could not generate the quiz. Please try again.");
  }
};
