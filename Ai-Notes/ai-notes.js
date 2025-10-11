//
// const prompt = "Write a sticky note for 'Consistency builds greatness'";
const noteTopic = document.querySelector("#noteTopic");
const generatBtn = document.querySelector("#generateBtn");

const aiNotesContainer = document.querySelector(".ai-notes-container");
const generateNotes = (title, note) => {
  let card = document.createElement("div");
  card.classList.add("card");

  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "mx-4");

  let cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");

  let cardText = document.createElement("p");
  cardText.classList.add("card-text");

  cardTitle.innerText = title;
  cardText.innerText = note;

  aiNotesContainer.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, cardText);
};

generatBtn.addEventListener("click", () => {
  const prompt = noteTopic.value;

  fetch("http://localhost:5000/generate-note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("🟨 Sticky Note:", data.text);
      // TODO: Display this text in your sticky note UI
      generateNotes(prompt, data.text);
    })
    .catch((err) => console.error("⚠️ Error:", err));
});
