const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt({ ingredientNames, count = 3 }) {
  const list = ingredientNames
    .map((ingredient) => `- ${ingredient}`)
    .join("\n");

  return `
            You are a helpful cooking assistant.

            Generate ${count} creative recipes using ONLY the ingredients below.

            Available ingredients:
            ${list}

            Requirements:
            - Use ONLY the ingredients listed above (you may suggest 1-3 optional additions per recipe)
            - If a recipe needs a staple (oil/water/salt), include it in optional_additions
            - The recipes MUST be meaningfully different from each other
            - Avoid minor variations of the same dish
            - Each recipe should differ by cooking method or dish concept
            - Keep instructions clear and concise (5-8 steps max)
            - Include estimated cooking time
            - difficulty must be one of: "easy", "medium", "hard"
            - Output MUST be valid JSON ONLY

            Return ONLY valid JSON.
            Do NOT include markdown, explanations, or any text outside the JSON.
            Return exactly ${count} recipe objects and do not include extra keys.

            [
                {
                    "title": "",
                    "ingredients_used": [],
                    "optional_additions": [],
                    "instructions": [],
                    "cooking_time": "",
                    "difficulty": ""
                }
            ]
            `.trim();
}

async function generateRecipesFromIngredients(ingredientNames, count = 3) {
  const res = await client.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    temperature: 0.4,
    messages: [
      { role: "user", content: buildPrompt({ ingredientNames, count }) },
    ],
  });

  return res.content?.[0]?.text ?? "[]";
}

module.exports = { generateRecipesFromIngredients };
