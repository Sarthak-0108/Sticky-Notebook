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
  deferredPrompt.prompt(); // Show the install prompt

  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);

  deferredPrompt = null;
  installBtn.hidden = true; // Hide after interaction
  installBanner.style.display = "none";
});

dismissBtn.addEventListener("click", () => {
  installBanner.style.display = "none";
});

//accessing elements from DOM
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
    }, 3000);
  } else {
    Alert.style.display = "block";
    Alert.innerHTML = "Dark Mode is enabled!";
    Alert.classList.add("alert-info");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-info");
    }, 3000);
  }
});

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
    setUserName();
    if (userName === null || !userName) {
      //agar user input na  de
      console.log(userName);

      navbarBranding.innerHTML = `Sarthak's Notebook`;
      localStorage.setItem("userName", "Sarthak");
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
    }, 3000);
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
      deleteNote(i);
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

        updateNote(i);
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

const deleteNote = (i) => {
  notesArray.splice(i, 1);
  localStorage.setItem("notes", JSON.stringify(notesArray));
  displayNotes();

  Alert.style.display = "block";
  Alert.innerHTML = "Your note was successfully Deleted.";
  Alert.classList.add("alert-warning");

  navbar.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  setTimeout(() => {
    Alert.style.display = "none";
    Alert.innerHTML = "";
    Alert.classList.remove("alert-warning");
  }, 3000);
};

const updateNote = (i) => {
  notesArray[i] = { title: noteTitle.value, content: noteContent.value };
  localStorage.setItem("notes", JSON.stringify(notesArray));
  displayNotes();

  updateNoteBtn.remove();

  const inputForm = document.querySelector("form");
  inputForm.append(addnoteBtn);

  Alert.style.display = "block";
  Alert.innerHTML = "Your note was successfully updated.";
  Alert.classList.add("alert-success");

  setTimeout(() => {
    Alert.style.display = "none";
    Alert.innerHTML = "";
    Alert.classList.remove("alert-success");
  }, 2500);

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
};

addnoteBtn.addEventListener("click", (event) => {
  event.preventDefault();
  createNotes();
  displayNotes();
});

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

  let dltBtn = document.createElement("button");
  dltBtn.classList.add("btn", "btn-danger", "mx-2");
  dltBtn.innerText = "Delete";
  dltBtn.disabled = true;

  let editBtn = document.createElement("button");
  editBtn.classList.add("btn", "btn-info", "mx-2");
  editBtn.innerText = "Edit";
  editBtn.disabled = true;

  cardTitle.innerText = title;
  cardText.innerText = note;

  aiNotesContainer.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, cardText, editBtn, dltBtn);
};

let aiNotesArr = JSON.parse(localStorage.getItem("ai-notes")) || [];

window.onload = () => {
  displayNotes();
  aiNotesArr.forEach((element) => {
    generateNotes(element.title, element.note);
  });
  if (mode === "light") {
    toggleBtn.checked = false;
    Alert.style.display = "block";
    Alert.innerHTML = "Click on the switch to enable dark mode.";
    Alert.classList.add("alert-info");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-info");
    }, 3000);
  } else {
    toggleBtn.checked = true;
  }
};

generatBtn.addEventListener("click", () => {
  let prompt = noteTopic.value;

  fetch("https://sticky-note-backend.onrender.com/generate-note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("🟨 Sticky Note:", data.text);
      // TODO: Display this text in your sticky note UI
      class aiNotes {
        constructor(title, note) {
          (this.title = title), (this.note = note);
        }
      }

      const note = new aiNotes(prompt, data.text);
      aiNotesArr.push(note);
      generateNotes(prompt, data.text);

      localStorage.setItem("ai-notes", JSON.stringify(aiNotesArr));
    })
    .catch((err) => console.error("⚠️ Error:", err));
});
