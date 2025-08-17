import { GoogleGenAI, Type } from "@google/genai";
import type { FlashcardData } from '../components/Flashcard';

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_API_KEY });

const flashcardSchema = {
  type: Type.OBJECT,
  properties: {
    flashcards: {
      type: Type.ARRAY,
      description: "An array of flashcards with front and back content.",
      items: {
        type: Type.OBJECT,
        properties: {
          front: {
            type: Type.STRING,
            description: "The question or term on the front of the flashcard.",
          },
          back: {
            type: Type.STRING,
            description: "The answer or definition on the back of the flashcard.",
          },
        },
        required: ["front", "back"],
      },
    },
  },
  required: ["flashcards"],
};

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

const getRandomSubset = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getDifficultyPrompt = (difficulty: string, topic: string, facts: string[], vocabulary: string[], concepts: string[]) => {
  const randomFacts = getRandomSubset(facts, 10);
  const randomVocab = getRandomSubset(vocabulary, 8);
  const randomConcepts = getRandomSubset(concepts, 4);
  
  const basePrompt = `Skep flitskaarte in Afrikaans vir Graad 4 leerders oor ${topic}. Gebruik hierdie kurrikulum inhoud:\n\nFeite: ${randomFacts.join('; ')}\nWoordeskaat: ${randomVocab.join(', ')}\nKonsepte: ${randomConcepts.join('; ')}`;
  
  switch (difficulty) {
    case 'Maklik':
      return `${basePrompt}\n\nSkep 8 eenvoudige flitskaarte:\n- 5 woordeskat kaarte: "Wat beteken [woord]?" met duidelike, eenvoudige antwoorde\n- 3 basiese definisie kaarte met maklike konsepte\nHou antwoorde kort en eenvoudig.`;
      
    case 'Gemiddeld':
      return `${basePrompt}\n\nSkep 10 gemiddelde flitskaarte:\n- 3 woordeskat kaarte met meer detail\n- 4 konsep kaarte wat begrip toets\n- 3 voorbeeld kaarte: "Gee 'n voorbeeld van..."\nSluit praktiese voorbeelde in.`;
      
    case 'Moeilik':
      return `${basePrompt}\n\nSkep 12 uitdagende flitskaarte:\n- 2 gevorderde woordeskat\n- 5 diep konsep vrae wat kritiese denke verlang\n- 3 vergelyking kaarte: "Wat is die verskil tussen..."\n- 2 toepassing kaarte: "Hoekom gebeur dit..."\nVerlang dieper begrip en analise.`;
      
    default:
      return basePrompt;
  }
};

export const generateFlashcards = async (topic: string, difficulty: string): Promise<FlashcardData[]> => {
  try {
    const kb = await loadKnowledgeBase();
    const topicContent = kb.subjects.science.content[topic];
    
    if (!topicContent) {
      throw new Error(`Geen kurrikulum inhoud gevind vir onderwerp: ${topic}`);
    }

    const prompt = getDifficultyPrompt(difficulty, topic, topicContent.facts, topicContent.vocabulary, topicContent.concepts);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
        temperature: 0.9,
        topP: 0.8
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (parsedJson && Array.isArray(parsedJson.flashcards)) {
      const flashcards: FlashcardData[] = parsedJson.flashcards.map((card: any, index: number) => ({
        id: `${topic}-${difficulty}-${index}`,
        front: card.front,
        back: card.back,
        topic,
        difficulty
      }));
      
      return flashcards;
    } else {
      console.error("Invalid JSON structure received from Gemini:", parsedJson);
      throw new Error("Kon nie geldige flitskaarte genereer nie. Die AI het 'n onverwagte formaat teruggestuur.");
    }
    
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Kon nie flitskaarte genereer nie. Probeer asseblief weer.");
  }
};