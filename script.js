//loading service woker

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered:", reg))
      .catch((err) =>
        console.error("Service Worker registration failed:", err)
      );
  });
}
//creating pwa functionality

let deferredPrompt;
const installBtn = document.getElementById("installBtn");
const installBanner = document.getElementById("installBanner");
const dismissBtn = document.getElementById("dismissBtn");

installBanner.hidden = true; // Default hidden

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);

  deferredPrompt = null;
  installBtn.hidden = true;
  installBanner.style.display = "none";
});

dismissBtn.addEventListener("click", () => {
  installBanner.style.display = "none";
});
//<---------------------- Declaring all Variables ------------------------------>

let noteTitle = document.querySelector("#note-title");
let noteContent = document.querySelector("#noteContent");

const noteTopic = document.querySelector("#noteTopic");
const generatBtn = document.querySelector("#generateBtn");

let Alert = document.querySelector(".alert");
const myModal = new bootstrap.Modal(document.getElementById("inputModal"));
const submitNameBtn = document.getElementById("submit");

let addnoteBtn = document.querySelector("#add-note");
let saveNoteBtn = document.querySelector("#save-note");

let navbarBranding = document.getElementById("navbar-branding");
let navbar = document.querySelector("nav");

const aiNotes = document.querySelector(".ai-notes");
const stickyNotes = document.querySelector(".sticky-notes");
const stickyToAiBtn = document.querySelector(".stickyToAi");
const aiToStickyBtn = document.querySelector(".aiToSticky");
const swapBtn = document.querySelector(".swap");
let aiNoteContent = document.querySelector("#aiNote-container");

const aiNotesContainer = document.querySelector(".ai-notes-container");
let aiNotesArr = JSON.parse(localStorage.getItem("ai-notes")) || [];
let aiNoteLable = document.querySelector("#aiNote-lable");
let aiTextarea = document.querySelector(".ai-textarea");
let aiBtnContainer = document.querySelector(".btnContainer");
let updateBtn;

const drop_down = document.querySelector("#dropdownMenuButton");
const options = document.querySelector("ul");

//<-------------------- Dark Mode Functionality ------------------------------->

let track = 0; // if even means light mode else dark mode
let mode = "light";

const toggleMode = () => {
  track += 1;

  navbar.classList.toggle("bg-body-tertiary");
  navbarBranding.classList.toggle("text-light");

  noteTitle.classList.toggle("bg-dark");
  noteTitle.classList.toggle("bg-gradient");
  noteTitle.classList.toggle("text-white");

  noteTopic.classList.toggle("bg-dark");
  noteTopic.classList.toggle("bg-gradient");
  noteTopic.classList.toggle("text-white");

  noteContent.classList.toggle("bg-dark");
  noteContent.classList.toggle("bg-gradient");
  noteContent.classList.toggle("text-white");

  aiNoteContent.classList.toggle("bg-dark");
  aiNoteContent.classList.toggle("bg-gradient");
  aiNoteContent.classList.toggle("text-white");

  options.classList.toggle("bg-dark");
  options.classList.toggle("text-white");

  document.body.classList.toggle("dark-mode");

  if (track % 2 === 0) {
    mode = "light";
    console.log("light mode");
  } else {
    mode = "dark";
    console.log("dark mode");
  }
  localStorage.setItem("mode", mode);
};
if (localStorage.getItem("mode") === "dark") {
  toggleMode();
}

let toggleBtn = document.getElementById("switchCheckDefault");
toggleBtn.addEventListener("click", () => {
  toggleMode();
  if (mode === "light") {
    Alert.style.display = "block";
    Alert.innerHTML = "Dark mode is disabled!";
    Alert.classList.add("alert-info");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-info");
    }, 1500);
  } else {
    Alert.style.display = "block";
    Alert.innerHTML = "Dark Mode is enabled!";
    Alert.classList.add("alert-info");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-info");
    }, 1500);
  }
});

//<--------------------  Swap functionality General To AI ---------------------->

stickyNotes.hidden = false;

swapBtn.addEventListener("click", () => {
  if (stickyNotes.hidden === false) {
    stickyNotes.hidden = true;
    aiNotes.hidden = false;
  } else {
    aiNotes.hidden = true;
    stickyNotes.hidden = false;
  }
});

//<--------------------  Sticky-Note functionality ----------------------------->

let noteContainer = document.querySelector(".notes-container");
let notesArray = JSON.parse(localStorage.getItem("notes")) || [];
let updateNoteBtn;

let userName;

function setUserName() {
  userName = document.getElementById("userInput").value;
  console.log("User entered:", userName);
  myModal.hide();
}

if (localStorage.getItem("userName")) {
  userName = localStorage.getItem("userName");
  navbarBranding.innerHTML = `${userName}'s Notebook`;
} else {
  myModal.show();
  submitNameBtn.addEventListener("click", () => {
    submitNameBtn.blur();
    setUserName();
    if (userName === null || !userName) {
      //agar user input na  de
      navbarBranding.innerHTML = `Your Notebook`;
    } else {
      navbarBranding.innerHTML = `${userName}'s Notebook`;
      localStorage.setItem("userName", userName.trim());
    }
  });
}

const createNotes = () => {
  class Note {
    constructor(title, content) {
      this.title = title;
      this.content = content;
    }
  }
  if (noteTitle.value.trim() === "" || noteContent.value.trim() === "") {
    Alert.style.display = "block";
    Alert.innerHTML = "Kindly enter a title and note before proceeding.";
    Alert.classList.add("alert-danger");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-danger");
    }, 1500);
  } else {
    let newNote = new Note(noteTitle.value, noteContent.value);
    notesArray.push(newNote);

    localStorage.setItem("notes", JSON.stringify(notesArray));

    noteTitle.value = "";
    noteContent.value = "";
  }
};

const displayNotes = () => {
  noteContainer.innerHTML = "";

  for (let i = notesArray.length - 1; i >= 0; i--) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `note-${i}`;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "mx-4");

    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");

    let cardText = document.createElement("p");
    cardText.classList.add("card-text");

    //creating a button to delete note
    let dltBtn = document.createElement("button");

    dltBtn.id = `dlt-btn${i}`;
    dltBtn.classList.add("btn", "btn-danger", "mx-2");
    dltBtn.innerText = "Delte";
    dltBtn.addEventListener("click", () => {
      deleteNote(i, "notes", notesArray, displayNotes);
    });

    //creating a btn to edit note
    let editBtn = document.createElement("button");
    editBtn.id = `edit-btn${i}`;

    editBtn.classList.add("btn", "btn-info", "mx-2");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", () => {
      for (let i = notesArray.length - 1; i >= 0; i--) {
        let disableDelBtn = document.getElementById(`dlt-btn${i}`);
        let disableEditBtn = document.getElementById(`edit-btn${i}`);

        disableDelBtn.disabled = true;
        disableEditBtn.disabled = true;
      }

      noteTitle.value = cardTitle.innerText;
      noteContent.value = cardText.innerText;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      addnoteBtn.remove();

      updateNoteBtn = document.createElement("button");
      updateNoteBtn.innerText = "Save";
      updateNoteBtn.addEventListener("click", () => {
        for (let i = notesArray.length - 1; i >= 0; i--) {
          let disableDelBtn = document.getElementById(`dlt-btn${i}`);
          let disableEditBtn = document.getElementById(`edit-btn${i}`);

          disableDelBtn.disabled = false;
          disableEditBtn.disabled = false;
        }

        updateNote(i, "sticky");
      });
      updateNoteBtn.classList.add("btn", "btn-success", "mx-4", "my-4");

      const inputForm = document.querySelector("form");
      inputForm.append(updateNoteBtn);
    });

    noteContainer.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, cardText, editBtn, dltBtn);

    cardTitle.innerText = notesArray[i].title;
    cardText.innerText = notesArray[i].content;
  }
};

const deleteNote = (i, noteType, notesArr, callback) => {
  notesArr.splice(i, 1);
  localStorage.setItem(noteType, JSON.stringify(notesArr));
  callback();
};
// also include functionality to update ai Notes

const updateNote = (i, noteType) => {
  if (noteType === "sticky") {
    notesArray[i] = { title: noteTitle.value, content: noteContent.value };
    localStorage.setItem("notes", JSON.stringify(notesArray));
    displayNotes();

    updateNoteBtn.remove();

    const inputForm = document.querySelector("form");
    inputForm.append(addnoteBtn);

    const note = document.getElementById(`note-${i}`);

    setTimeout(() => {
      note.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 1000);

    note.classList.add("highlight-note");
    setTimeout(() => {
      note.classList.remove("highlight-note");
    }, 2000);

    noteTitle.value = "";
    noteContent.value = "";
  } else {
    aiNotesArr[i] = { title: noteTopic.value, note: aiNoteContent.value };
    localStorage.setItem("ai-notes", JSON.stringify(aiNotesArr));
    displayAiNotes();

    const note = document.getElementById(`ai-note-${i}`);

    setTimeout(() => {
      note.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 1000);

    note.classList.add("highlight-note");
    setTimeout(() => {
      note.classList.remove("highlight-note");
    }, 2000);

    noteTopic.value = "";
    aiNoteContent.value = "";
  }

  Alert.style.display = "block";
  Alert.innerHTML = "Your note was successfully updated.";
  Alert.classList.add("alert-success");

  setTimeout(() => {
    Alert.style.display = "none";
    Alert.innerHTML = "";
    Alert.classList.remove("alert-success");
  }, 2500);
};

addnoteBtn.addEventListener("click", (event) => {
  event.preventDefault();
  createNotes();
  displayNotes();
});
//<----------------------------  functionality of ai Notes -------------------------------->

let subject;

document.querySelector("#math").addEventListener("click", () => {
  subject = "Math";
  drop_down.innerHTML = subject;
  console.log(subject);
});
document.querySelector("#science").addEventListener("click", () => {
  subject = "Science";
  drop_down.innerHTML = subject;
  console.log(subject);
});
document.querySelector("#arts").addEventListener("click", () => {
  subject = "Arts";
  drop_down.innerHTML = subject;
  console.log(subject);
});

const createAiNotes = (title, note) => {
  class AiNotes {
    constructor(title, note) {
      (this.title = title), (this.note = note);
    }
  }

  const newNote = new AiNotes(title, note);
  aiNotesArr.push(newNote);
  localStorage.setItem("ai-notes", JSON.stringify(aiNotesArr));
  noteTopic.value = "";
};

const displayAiNotes = () => {
  aiNotesContainer.innerHTML = "";

  for (let i = aiNotesArr.length - 1; i >= 0; i--) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `ai-note-${i}`;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");

    let cardText = document.createElement("p");
    cardText.classList.add("card-text");

    let dltBtn = document.createElement("button");
    dltBtn.classList.add("btn", "btn-danger", "mx-2");
    dltBtn.innerText = "Delete";
    dltBtn.id = `ai-note-dltBtn-${i}`;

    dltBtn.addEventListener("click", () => {
      deleteNote(i, "ai-notes", aiNotesArr, displayAiNotes);
    });

    let editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-info", "mx-2");
    editBtn.innerText = "Edit";
    editBtn.id = `aiNote-edit-btn${i}`;

    editBtn.addEventListener("click", () => {
      aiNoteLable.style.display = "block";

      aiNoteContent.style.display = "block";
      aiNoteContent.style.height = "10rem";
      aiNotesContainer.style.marginTop = "10rem";

      noteTopic.value = cardTitle.innerText;
      aiNoteContent.value = cardText.innerText;
      aiTextarea.hidden = false;

      updateBtn = document.createElement("button");

      updateBtn.classList.add("btn", "btn-success");
      updateBtn.id = "aiNote-saveBtn";
      updateBtn.innerText = "Save";
      aiBtnContainer.append(updateBtn);

      for (let i = aiNotesArr.length - 1; i >= 0; i--) {
        let disableDelBtn = document.getElementById(`ai-note-dltBtn-${i}`);
        let disableEditBtn = document.getElementById(`aiNote-edit-btn${i}`);

        disableDelBtn.disabled = true;
        disableEditBtn.disabled = true;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      updateBtn.addEventListener("click", () => {
        for (let j = aiNotesArr.length - 1; j >= 0; j--) {
          let disableDelBtn = document.getElementById(`ai-note-dltBtn-${j}`);
          let disableEditBtn = document.getElementById(`aiNote-edit-btn${j}`);

          disableDelBtn.disabled = false;
          disableEditBtn.disabled = false;
        }
        generatBtn.style.display = "block";
        aiNoteLable.style.display = "none";

        aiNoteContent.style.display = "none";
        aiNotesContainer.style.marginTop = "0rem";

        updateNote(i, "ai");
        updateBtn.remove();
      });

      generatBtn.style.display = "none";
    });

    cardTitle.innerText = aiNotesArr[i].title;
    cardText.innerText = aiNotesArr[i].note;

    aiNotesContainer.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, cardText, editBtn, dltBtn);
  }
};

window.onload = () => {
  displayNotes();
  displayAiNotes();

  if (mode === "light") {
    toggleBtn.checked = false;
    Alert.style.display = "block";
    Alert.innerHTML = "Click on the switch to enable dark mode.";
    Alert.classList.add("alert-info");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-info");
    }, 1500);
  } else {
    toggleBtn.checked = true;
  }
};

generatBtn.addEventListener("click", () => {
  if (!noteTopic.value || noteTopic.value === "") {
    console.log("invalid input");

    Alert.style.display = "block";
    Alert.innerHTML = "please enter your objective question to continue";
    Alert.classList.add("alert-danger");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-danger");
    }, 1500);

    return "please enter a question to continue:";
  }
  document.getElementById("loadingSpinner").style.display = "block";

  //   let prompt = ` You are not a chat assistant. You are an API that returns raw, ultra-short sticky note content for students.

  //     Rules:
  //     1. Output only one word for objective-type questions.
  //     2. Do not use vague or ambiguous answers (e.g., "two possible answers").
  //     3. Do not include important points, tips, or explanations.
  //     4. Do not use greetings, instructions, or closing statements.
  //     5. Output must contain only:
  //       - A single word or phrase answer on the first line.
  //     6. Be strictly minimal and factual in tone.

  // User question:
  // ${noteTopic.value.toUpperCase()}`;
  let prompt;

  switch (subject) {
    case "Math":
      prompt = `You are an expert mathematics teacher for Class 10 (Bihar Board, 2025). Give the correct and updated answer to the following question in a short, precise, and one-line format that is easy to understand. Avoid extra explanation, examples, or technical complexity.

      Q: ${noteTopic.value.toUpperCase()}`;
      break;
    case "Science":
      prompt = `"prompt": "You are an expert teacher for Class 10 Science (Bihar Board, 2025). Give the correct and updated answer for this question in just one line. Avoid extra explanation.\n\nQ: ${noteTopic.value.toUpperCase()}`;
      break;
    case "Arts":
      prompt = `You are an expert teacher for Class 10 Arts (Bihar Board, 2025). Give the correct and updated answer to the following question in a short, precise, and one-line format that is easy to understand. Avoid extra explanation or complex language.

      Q: ${noteTopic.value.toUpperCase()}`;
      break;
    default:
      prompt = `You are a highly knowledgeable and student-friendly teacher for Class 10 and 11 students (Bihar Board, 2025). The student has asked a question but not selected any subject. Identify the subject automatically and give the correct and updated answer in just one line. Avoid complex language and unnecessary explanation.

      Q: ${noteTopic.value.toUpperCase()}`;
      break;
  }

  // let prompt = `"prompt": "You are an expert teacher for Class 11 Science (Bihar Board, 2025), specialized in Physics, Chemistry, and Math. Give the correct and updated answer to the following question in simple and easy language. Keep the answer short, clear, and in one line without extra explanation.\n\nQ: ${noteTopic.value.toUpperCase()}"`;

  fetch("https://sticky-note-backend.onrender.com/generate-note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("🟨 Sticky Note:", data.text);

      createAiNotes(noteTopic.value.toLowerCase(), data.text);
      document.getElementById("loadingSpinner").style.display = "none";

      displayAiNotes();
    })
    .catch((err) => console.error("⚠️ Error:", err));
});
