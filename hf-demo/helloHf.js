import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  const model = "EleutherAI/gpt-neo-125M";
  const inputText = `System: You are a helpful study planner.
User: Generate a 1-day personalized study plan for a DSA student.`;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/pipeline/text-generation/${model}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: inputText }),
      }
    );

    const rawText = await response.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("Raw Response Text:", rawText);
      return;
    }

    console.log("AI Response:\n", data[0]?.generated_text || data);
  } catch (err) {
    console.error("Error calling Hugging Face API:", err);
  }
}

run();
