import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(express.json());

// FRONTED
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>AI Doubt Solver Pro</title>
    <style>
      body {
        font-family: Arial;
        background: #0f172a;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h1 { color: #38bdf8; }

      #chat {
        width: 90%;
        max-width: 600px;
        height: 400px;
        overflow-y: auto;
        background: #1e293b;
        padding: 10px;
        border-radius: 10px;
      }

      .msg {
        margin: 10px;
        padding: 10px;
        border-radius: 10px;
        max-width: 80%;
      }
 
      .user {
        background: #38bdf8
        align-self: flex-end;
        color: black;
      }

      .bot {
        background: #334155;
      }

      #controls {
        margin-top: 10px;
      }

      input, select {
        padding: 10px;
        width: 200px;
      }
 
      button {
        padding: 10px;
        background: #38bdf8;
        border: none;
        cursor: pointer;
      }
     </style>
   </head>
   
   </body>

      <h1>🤖 AI Doubt Solver Pro</h1>

      <div id="chat"></div>

      <div id="controls">
        <select id="subject">
          <option>General</option>
          <option>Math</option>
          <option>English</option>
          <option>Science</option>
        </select>
        <br><br>
        <input id="input"
placeholder="Ask your doubt...">
      <button onclick="send()">Send</
button>
    </div>

    <script>
      const chat =
document.getElementById("chat");

      function addMessage(text, type)
{
        let div =
document.createElement("div");
        div.className = "msg " + type;
        div.innerText = text;
        chat.appendChild(div);
        chat.scrollTop =
chat.scrollHeight;
      }

      async function send() {
        let input =
document.getElementById("subject").value;

        let text = input.value;
        if (!text) return;

        addMessage(text, "user");

        let res = await fetch("/api",
{
          method: "POST",
          headers: {"Content-Type":
"application/json"}
          body:
JSON.stringify({ question: text,
subject })
        });

        let data = await res.json();
        addMessage(data.answer,
"bot");

        input.value = "";

        // Save chat
        localStorage.setItem("chat",
chat.innerHTML);
      }

      // Load chat history
      window.onload = () => {
        chat.innerHTML =
localStorage.getItem("chat") || "";
      }
    </script>

  </body>
  </html>
  `);
});

// BACKEND
app.post("/api", async (req, res) => {
  const { question, subject } =
req.body;

  try {
    const response = await
fetch("https://api.openai.com/v1/chat
/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer
sk-proj-g19mT1lexMfPbyT-
ICHO3GNaTtYU42eSaWRX1OyOuY7rKA-sUTFE2_WOqe-
Hd2y6R_BHXEeU8pT3BlbkFJCbYubfDV5Na1OUCQAlneAdLQMQ2zbamMyuG9Lj6xF9eRHeEp4plw6TBUFEVe6xevrUtRqBwE4A",
        "Content-Type": "application/
json"

      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: \`You are a
helpful \${subject} teacher. Explain
answers simply, step-by-step for
students.\`
          },
          { role: "user", content:
question }
        ]
      })
    });

    const data = await
response.json();
    res.json({ answer:
data.choices[0].message.content });

  } catch (err) {
    res.json({ answer: "Error: " +
err.message });
  }
});

app.listen(PORT, () => {
  console.log("🔥 Pro App running at
https://localhost:3000");
});