const { GoogleGenAI } =require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(content) {
    const response=await ai.models.generateContent({
        model:"gemini-2.0-flash",
        contents:content,
        config:{
            temperature:0.7,
            systemInstruction:`
            You are a helpful assistant.
            Whenever a next line is required, include it.
            you can use emojs if required not every time.
            replace ** with space and \n with new line.`
        }
    })
    return response.text
};

async function generateVector(content) {
    const response=await ai.models.embedContent({
        model:'gemini-embedding-001',
        contents:content,
        config:{
            outputDimensionality:768
        }
    })
    return response.embeddings[0].values
}

module.exports={
    generateResponse,
    generateVector
};