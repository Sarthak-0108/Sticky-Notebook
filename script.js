//accessing elements from DOM
let noteTitle = document.querySelector("#note-title");
let noteContent = document.querySelector("#noteContent");

let addnoteBtn = document.querySelector("button");
let saveNoteBtn = document.querySelector("#save-note");

let navbarBranding = document.getElementById("navbar-branding");
let navbar = document.querySelector("nav");

let track = 0; // if even means light mode else dark mode
let mode;

const toggleMode = () => {
  track += 1;

  navbar.classList.toggle("bg-body-tertiary");
  navbarBranding.classList.toggle("text-light");

  noteTitle.classList.toggle("bg-dark");
  noteTitle.classList.toggle("bg-gradient");
  noteTitle.classList.toggle("text-white");

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
toggleBtn.addEventListener("click", toggleMode);

let noteContainer = document.querySelector(".notes-container");
let notesArray = JSON.parse(localStorage.getItem("notes")) || [];
let updateNoteBtn;

let userName;

if (localStorage.getItem("userName")) {
  userName = localStorage.getItem("userName");
  navbarBranding.innerHTML = `${userName}'s Notebook`;
} else {
  userName = prompt("please enter your name :");

  if (userName === null || !userName) {
    //agar user input na  de
    navbarBranding.innerHTML = `Sarthak's Notebook`;
    localStorage.setItem("userName", "Sarthak");
  } else {
    navbarBranding.innerHTML = `${userName}'s Notebook`;
    localStorage.setItem("userName", userName.trim());
  }
}

const createNotes = () => {
  class Note {
    constructor(title, content) {
      this.title = title;
      this.content = content;
    }
  }
  if (noteTitle.value.trim() === "" || noteContent.value.trim() === "") {
    alert("Kindly enter a title and note before proceeding.");
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
  alert("Your note was successfully Deleted.");
};

const updateNote = (i) => {
  notesArray[i] = { title: noteTitle.value, content: noteContent.value };
  localStorage.setItem("notes", JSON.stringify(notesArray));
  displayNotes();

  updateNoteBtn.remove();

  const inputForm = document.querySelector("form");
  inputForm.append(addnoteBtn);

  alert("Your note was successfully updated.");

  const note = document.getElementById(`note-${i}`);

  note.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

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

window.onload = displayNotes;
