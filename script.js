//accessing elements from DOM
let noteTitle = document.querySelector("#note-title");
let noteContent = document.querySelector("#noteContent");

let addnoteBtn = document.querySelector("button");
let saveNoteBtn = document.querySelector("#save-note");

let noteContainer = document.querySelector(".notes-container");
let notesArray = JSON.parse(localStorage.getItem("notes")) || [];
let updateNoteBtn;

let navbar = document.getElementById("navbar-branding");
let userName;

if(localStorage.getItem("userName")){
   userName = localStorage.getItem("userName");
   navbar.innerHTML = `${userName}'s Notebook`;
} else {
   userName = prompt('please enter your name :');

    if(userName === null || !userName){ //agar user input na  de
      navbar.innerHTML = `Sarthak's Notebook`;
      localStorage.setItem("userName","Sarthak");
  } else {
    navbar.innerHTML = `${userName}'s Notebook`;
    localStorage.setItem("userName",userName.trim());
  }
    alert("please wait for few seconds after clicking on add note button")
}

 const createNotes = () => {
  class Note {
    constructor(title, content) {
      this.title = title;
      this.content = content;
    }
  }
      let newNote = new Note(noteTitle.value,noteContent.value);
      notesArray.push(newNote);

      localStorage.setItem("notes", JSON.stringify(notesArray));

      noteTitle.value = "";
      noteContent.value = "";
};


const displayNotes = () => {
    noteContainer.innerHTML = "";

    for(let i=notesArray.length-1; i>=0; i--){
    
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `note-${i}`;
    
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let cardTitle = document.createElement("h1");
    cardTitle.classList.add("card-title");

    let cardText = document.createElement("p");
    cardText.classList.add("card-text");

   //creating a button to delete note
    let dltBtn = document.createElement("button");
    dltBtn.classList.add("button");
    dltBtn.innerText = "Delte";
    dltBtn.addEventListener("click",()=>{
      deleteNote(i)
    });

    //creating a btn to edit note
    let editBtn = document.createElement("button");
    editBtn.classList.add("button");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click",()=>{

      noteTitle.value = cardTitle.innerText;
      noteContent.value = cardText.innerText;

      window.scrollTo({
        top:0,
        behavior:'smooth'
      });

      addnoteBtn.remove();

      updateNoteBtn = document.createElement("button");
      updateNoteBtn.innerText = "Save";
      updateNoteBtn.classList.add("btn", "btn-success", "update-btn");
      updateNoteBtn.addEventListener("click",()=>{

      updateNote(i)
      });

      const inputForm = document.querySelector("form");
      inputForm.append(updateNoteBtn);
    })

    noteContainer.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, cardText,dltBtn,editBtn);

    cardTitle.innerText = notesArray[i].title;
    cardText.innerText = notesArray[i].content;
    console.log(i)
  
 };
};

const deleteNote=(i)=>{
  notesArray.splice(i, 1);
  localStorage.setItem("notes", JSON.stringify(notesArray)); 
  displayNotes();
  alert("Your note was successfully Deleted.")
}

const updateNote = (i) =>{
  notesArray[i] = {title:noteTitle.value,content:noteContent.value}
  localStorage.setItem("notes",JSON.stringify(notesArray));
  displayNotes();

  updateNoteBtn.remove();

  const inputForm = document.querySelector("form");
  inputForm.append(addnoteBtn);

  alert("Your note was successfully updated.")

  const note = document.getElementById(`note-${i}`);

  note.scrollIntoView({
    behavior:'smooth',
    block:'center'
  });

  note.classList.add("highlight-note");
        setTimeout(()=>{
          note.classList.remove("highlight-note")
        },2000)

  noteTitle.value = '';
  noteContent.value = '';
}

  addnoteBtn.addEventListener("click",(event)=>{
    event.preventDefault();
   createNotes();
   displayNotes();
  });

  window.onload = displayNotes;


 
