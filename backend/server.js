import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { CohereClientV2 } from "cohere-ai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

const cohere = new CohereClientV2({
  token: COHERE_API_KEY,
});

app.post("/generate-note", async (req, res) => {
  const { prompt } = req.body;

  try {
    // const cohereResponse = await fetch("https://api.cohere.ai/generate", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${COHERE_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: "command-r-plus",
    //     prompt: prompt,
    //     max_tokens: 50,
    //     temperature: 0.2,
    //   }),
    // });
    const cohereResponse = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const data = cohereResponse.message.content[0];
    console.log(data);
    res.json(data);

    // const data = await cohereResponse.json();
    // console.log(data);
    // if (data && data.text) {
    //   res.json({ text: data.text.trim() });
    // } else if (data.message) {
    //   res.status(400).json({ error: data.message });
    // } else {
    //   res.status(500).json({ error: "Unexpected response format", raw: data });
    // }
  } catch (error) {
    console.error("Error connecting to Cohere:", error);
    res.status(500).json({ error: "Server error while contacting Cohere." });
  }
});

app.get("/", (req, res) => {
  res.send("🛠️ AI Note Backend is running.");
});
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 AI Note Backend running on http://localhost:${PORT}`)
);
