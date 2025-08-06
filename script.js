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
const options = document.querySelectorAll("a");
let standard_drop_down = document.querySelector("#choose-standard");
let uploadImgBtn = document.querySelector("#Upload-imgBtn");
let ul = document.querySelectorAll("ul");

const folderDropdown = document.getElementById("folderSelect");

//<-------------------- Dark Mode Functionality ------------------------------->

let track = 0; // if even means light mode else dark mode
let mode = "light";

const toggleMode = () => {
  track += 1;

  navbar.classList.toggle("bg-body-tertiary");
  // navbar.classList.toggle("bg-dark");
  navbar.classList.toggle("navbar-dark");

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

  folderDropdown.classList.toggle("bg-dark");
  folderDropdown.classList.toggle("text-white");

  standard_drop_down.classList.toggle("bg-dark");
  standard_drop_down.classList.toggle("bg-gradient");
  standard_drop_down.classList.toggle("text-white");
  standard_drop_down.classList.toggle("btn-info");

  drop_down.classList.toggle("bg-dark");
  drop_down.classList.toggle("bg-gradient");
  drop_down.classList.toggle("text-white");
  drop_down.classList.toggle("btn-info");

  uploadImgBtn.classList.toggle("bg-dark");
  uploadImgBtn.classList.toggle("bg-gradient");
  uploadImgBtn.classList.toggle("text-white");
  uploadImgBtn.classList.toggle("btn-info");

  ul.forEach((ul) => {
    ul.classList.toggle("bg-dark");
  });

  options.forEach((li) => {
    li.classList.toggle("bg-dark");
    li.classList.toggle("text-white");
  });
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

// stickyNotes.hidden = ture;
// aiNotes.hidden = false;

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

let noteContainer = document.querySelector("#category-general");
let updateNoteBtn;
let userName;

function setUserName() {
  userName = document.getElementById("userInput").value;
  console.log("User entered:", userName);
  myModal.hide();
}

if (localStorage.getItem("userName")) {
  userName = localStorage.getItem("userName");
  navbarBranding.innerHTML = `${userName}'s Pibook`;
} else {
  myModal.show();
  submitNameBtn.addEventListener("click", () => {
    submitNameBtn.blur();
    setUserName();
    if (userName === null || !userName) {
      //agar user input na  de
      navbarBranding.innerHTML = `Your Pibook`;
    } else {
      navbarBranding.innerHTML = `${userName}'s Pibook`;
      localStorage.setItem("userName", userName.trim());
    }
  });
}
//<_________________________________ creating folder for notes store _______________________________>

const folder_modal = new bootstrap.Modal(
  document.getElementById("enter-folder")
);
const newFolderInput = document.querySelector("#student-folder");
const addFolderBtn = document.querySelector("#submit-folder");

let data;
let currentFolder = "general";
let allNotes = JSON.parse(localStorage.getItem("allNotes")) || {};

let folderMangeModal = new bootstrap.Modal(
  document.querySelector("#folderManagementModal")
);
let folderList = document.querySelector("#folderList");
let folderManageIcon = document.querySelector("#manageFoldersBtn");

const init = () => {
  data = JSON.parse(localStorage.getItem("allNotes")) || {};
  let notesData = JSON.parse(localStorage.getItem("notes"));

  // Migrate old format data
  if (Array.isArray(notesData)) {
    let newNotesData = { general: notesData };
    localStorage.setItem("notes", JSON.stringify(newNotesData));
    data.general = newNotesData.general;
    localStorage.setItem("allNotes", JSON.stringify(data));
  }
  if (!currentFolder) {
    currentFolder = "general";
    console.log("abhi wala hu" + currentFolder);
  }
  console.log(currentFolder);
  if (!data[currentFolder]) data[currentFolder] = [];

  localStorage.setItem("allNotes", JSON.stringify(data));
  let folderArr = Object.keys(data);
  updateFolderDropdown(folderArr);
  currentFolder = folderDropdown.value;
  displayNotes();
};

function updateFolderDropdown(folders) {
  folderDropdown.innerHTML = "";
  folders.forEach((folder) => {
    let option = document.createElement("option");
    option.id = `option-${folder}`;
    option.value = folder;
    option.textContent = folder;
    folderDropdown.appendChild(option);
  });
}

const folderManagement = (folder) => {
  folder.forEach((folder) => {
    let list = document.createElement("li");
    list.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    list.id = `list-${folder}`;

    let folderName = document.createElement("span");
    folderName.contentEditable = true;
    folderName.classList.add("folder-name");
    folderName.innerText = folder;

    let btnContainer = document.createElement("div");

    let editFolderBtn = document.createElement("button");
    // editFolderBtn.onclick = (folder) => {
    //   alert("we are working on this feature.")
    // };
    editFolderBtn.innerText = "✏️ Edit";
    editFolderBtn.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-primary",
      "me-2",
      "edit-folder"
    );

    let dltFolderBtn = document.createElement("button");
    dltFolderBtn.innerText = "🗑️ Delete";
    dltFolderBtn.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-danger",
      "delete-folder"
    );
    dltFolderBtn.onclick = () => {
      let userResponse = confirm(
        "Are you sure you want to delete this folder?"
      );
      if (userResponse === true) {
        if (data[folder]) {
          let deleteData = data[folder];
          delete data[folder];
          localStorage.setItem("allNotes", JSON.stringify(data));

          document.getElementById(`list-${folder}`).remove();
          currentFolder = null;
          init();
          displayNotes();
          console.log(deleteData);
        } else {
          console.warn("this folder does not exist");
        }
      }
    };

    folderList.append(list);
    list.append(folderName, btnContainer);
    btnContainer.append(editFolderBtn, dltFolderBtn);
  });
};

folderDropdown.addEventListener("change", () => {
  currentFolder = folderDropdown.value;
  displayNotes();
});

folderManageIcon.onclick = () => {
  folderList.innerHTML = "";
  console.log("i am working");
  folderManagement(Object.keys(data));
  folderMangeModal.show();
};

document.querySelector("#plus-icon").addEventListener("click", () => {
  folder_modal.show();
});

addFolderBtn.addEventListener("click", () => {
  addFolderBtn.blur();
  folder_modal.hide();
  if (newFolderInput.value === null || !newFolderInput.value) {
    Alert.style.display = "block";
    Alert.innerHTML = "Kindly enter folder name before proceeding.";
    Alert.classList.add("alert-danger");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-danger");
    }, 2500);
    return;
  } else {
    currentFolder = newFolderInput.value;
    init();

    Alert.style.display = "block";
    Alert.innerHTML = `${newFolderInput.value} folder has successfully created.`;
    Alert.classList.add("alert-success");

    setTimeout(() => {
      Alert.style.display = "none";
      Alert.innerHTML = "";
      Alert.classList.remove("alert-success");
    }, 1500);
  }
  newFolderInput.value = "";
});
// <--------------------------------------  core functionality of sticky note --------------------------------->
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-GB");

const createNotes = () => {
  class Note {
    constructor(title, content, date) {
      this.title = title;
      this.content = content;
      this.date = date;
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
    return;
  }
  //future update needed - setTimeOut
  if (!data || !currentFolder || !data[currentFolder]) {
    Alert.style.display = "block";
    Alert.innerHTML = "Error: Folder not selected or data missing.";
    Alert.classList.add("alert-danger");
    return;
  }
  console.log(formattedDate);

  let newNote = new Note(noteTitle.value, noteContent.value, formattedDate);
  data[currentFolder].push(newNote);
  localStorage.setItem("allNotes", JSON.stringify(data));

  noteTitle.value = "";
  noteContent.value = "";
};

const displayNotes = () => {
  if (!data || !data[currentFolder]) {
    console.warn("No notes found for current folder:", currentFolder);
    return;
  }
  let index = 0;

  noteContainer.innerHTML = "";
  let currentArr = data[currentFolder];

  for (let i = currentArr.length - 1; i >= 0; i--) {
    index++;
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `note-${i}`;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "mx-4");

    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");

    let cardText = document.createElement("p");
    cardText.classList.add("card-text");

    let badgeContainer = document.createElement("div");
    badgeContainer.classList.add("badge-container");

    let brand = document.createElement("div");
    brand.classList.add("brand");

    let serialBadge = document.createElement("span");
    serialBadge.classList.add("serial-badge");
    serialBadge.innerText = index;

    let downloadBtn = document.createElement("button");
    downloadBtn.classList.add("btn", "btn-outline-secondary", "download-note");
    downloadBtn.innerText = "⬇️";

    downloadBtn.onclick = () => {
      downloadBtn.classList.add("rotating");

      downloadNoteAsImage(`note-${i}`).then(() => {
        downloadBtn.classList.remove("rotating");
      });
    };

    let noteDate = document.createElement("span");
    if (currentArr[i].date) {
      noteDate.classList.add("note-date");
      noteDate.innerText = currentArr[i].date;
    }

    //creating a button to delete note
    let dltBtn = document.createElement("button");

    dltBtn.id = `dlt-btn${i}`;
    dltBtn.classList.add("btn", "btn-danger", "mx-2");
    dltBtn.innerText = "Delete";
    dltBtn.addEventListener("click", () => {
      deleteNote(i, "allNotes", currentArr, displayNotes, data);
    });

    //creating a btn to edit note
    let editBtn = document.createElement("button");
    editBtn.id = `edit-btn${i}`;

    editBtn.classList.add("btn", "btn-info", "mx-2");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", () => {
      for (let i = currentArr.length - 1; i >= 0; i--) {
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
        for (let i = currentArr.length - 1; i >= 0; i--) {
          let disableDelBtn = document.getElementById(`dlt-btn${i}`);
          let disableEditBtn = document.getElementById(`edit-btn${i}`);

          disableDelBtn.disabled = false;
          disableEditBtn.disabled = false;
        }

        updateNote(i, "sticky", currentArr);
      });
      updateNoteBtn.classList.add("btn", "btn-success", "mx-4", "my-4");

      const inputForm = document.querySelector("form");
      inputForm.append(updateNoteBtn);
    });

    noteContainer.append(card);
    card.append(badgeContainer, downloadBtn, cardBody);
    cardBody.append(noteDate, cardTitle, cardText, editBtn, dltBtn);
    badgeContainer.append(brand, serialBadge);
    cardTitle.innerText = currentArr[i].title;
    cardText.innerText = currentArr[i].content;
  }
};

function downloadNoteAsImage(noteId) {
  const noteElement = document.getElementById(noteId);

  return html2canvas(noteElement).then((canvas) => {
    const link = document.createElement("a");
    link.download = `${noteId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}

const deleteNote = (
  i,
  localStorageKey,
  notesArr,
  callback,
  localStorageObj
) => {
  notesArr.splice(i, 1);
  localStorage.setItem(localStorageKey, JSON.stringify(localStorageObj));
  callback();
};
// also include functionality to update ai Notes

const updateNote = (i, noteType, currentArr) => {
  if (noteType === "sticky") {
    if (currentArr[i].date) {
      currentArr[i] = {
        title: noteTitle.value,
        content: noteContent.value,
        date: currentArr[i].date,
      };
    } else {
      currentArr[i] = {
        title: noteTitle.value,
        content: noteContent.value,
      };
    }
    localStorage.setItem("allNotes", JSON.stringify(data));
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
    if (aiNotesArr[i].date) {
      aiNotesArr[i] = {
        title: noteTopic.value,
        note: aiNoteContent.value,
        date: aiNotesArr[i].date,
      };
    } else {
      aiNotesArr[i] = { title: noteTopic.value, note: aiNoteContent.value };
    }
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

//image upload functionality
let cropModal = new bootstrap.Modal(document.querySelector("#cropModal"));
document.addEventListener("DOMContentLoaded", () => {
  let cropper;
  const imageInput = document.getElementById("imageInput");
  const imageToCrop = document.getElementById("imageToCrop");

  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    cropModal.show();
    const reader = new FileReader();
    reader.onload = () => {
      imageToCrop.src = reader.result;

      // Delay to ensure image is loaded
      setTimeout(() => {
        if (cropper) cropper.destroy(); // remove previous instance
        cropper = new Cropper(imageToCrop, {
          aspectRatio: NaN, // user-defined crop
          viewMode: 1,
          background: false,
        });
      }, 100);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("cropBtn").addEventListener("click", () => {
    document.getElementById("processingBar").style.display = "block";

    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();

    canvas.toBlob((blob) => {
      if (!blob) return;

      // Manually add a fake name to blob (to avoid .name error)
      blob.name = "image.png";
      // Now pass this blob to Tesseract.js for OCR
      Tesseract.recognize(blob, "eng").then(({ data: { text } }) => {
        console.log("Extracted Text:", text);
        noteTopic.value = text;
        document.getElementById("processingBar").style.display = "none";
        generateNote();
      });
    }, "image/png");
    cropModal.hide();
  });
});

let subject;
let standard;

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
document.querySelector("#computer").addEventListener("click", () => {
  subject = "Computer";
  drop_down.innerHTML = subject;
  console.log(subject);
});
document.querySelector("#nineth").addEventListener("click", () => {
  standard = "9th";
  standard_drop_down.innerText = standard;
  console.log(standard);
});
document.querySelector("#tenth").addEventListener("click", () => {
  standard = "10th";
  standard_drop_down.innerText = standard;
  console.log(standard);
});
document.querySelector("#eleventh").addEventListener("click", () => {
  standard = "11th";
  standard_drop_down.innerText = standard;
  console.log(standard);
});
document.querySelector("#Twelfth").addEventListener("click", () => {
  standard = "12th";
  standard_drop_down.innerText = standard;
  console.log(standard);
});

const createAiNotes = (title, note) => {
  class AiNotes {
    constructor(title, note, date) {
      this.title = title;
      this.note = note;
      this.date = date;
    }
  }

  const newNote = new AiNotes(title, note, formattedDate);
  aiNotesArr.push(newNote);
  localStorage.setItem("ai-notes", JSON.stringify(aiNotesArr));
  noteTopic.value = "";
};

const displayAiNotes = () => {
  let index = 0;
  let crptedAiNotes = JSON.parse(localStorage.getItem("ai-notes"));
  if (crptedAiNotes && !Array.isArray(crptedAiNotes)) {
    localStorage.removeItem("ai-notes");
    console.warn("Corrupted ai-notes detected. Resetting to fix format...");
    alert("we are so sorry for loss of your ai generated notes!");
    location.reload();
  }

  aiNotesContainer.innerHTML = "";
  for (let i = aiNotesArr.length - 1; i >= 0; i--) {
    index++;
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `ai-note-${i}`;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");

    let cardText = document.createElement("p");
    cardText.classList.add("card-text");

    let badgeContainer = document.createElement("div");
    badgeContainer.classList.add("badge-container");

    let brand = document.createElement("div");
    brand.classList.add("brand");

    let serialBadge = document.createElement("span");
    serialBadge.classList.add("serial-badge");
    serialBadge.innerText = index;

    let downloadBtn = document.createElement("button");
    downloadBtn.classList.add("btn", "btn-outline-secondary", "download-note");
    downloadBtn.innerText = "⬇️";

    downloadBtn.onclick = () => {
      downloadBtn.classList.add("rotating");
      downloadNoteAsImage(`ai-note-${i}`).then(() => {
        downloadBtn.classList.remove("rotating");
      });
    };

    let noteDate = document.createElement("span");
    if (aiNotesArr[i].date) {
      noteDate.classList.add("note-date");
      noteDate.innerText = aiNotesArr[i].date;
    }

    let dltBtn = document.createElement("button");
    dltBtn.classList.add("btn", "btn-danger", "mx-2");
    dltBtn.innerText = "Delete";
    dltBtn.id = `ai-note-dltBtn-${i}`;

    dltBtn.addEventListener("click", () => {
      deleteNote(i, "ai-notes", aiNotesArr, displayAiNotes, aiNotesArr);
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
    card.append(badgeContainer, downloadBtn, cardBody);
    badgeContainer.append(brand, serialBadge);
    cardBody.append(noteDate, cardTitle, cardText, editBtn, dltBtn);
  }
};

window.onload = () => {
  init();
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
function isHinglish(args) {
  const hindiWords = [
    "kya",
    "kaise",
    "kyunki",
    "batao",
    "karna",
    "chahiye",
    "kab",
    "kaha",
    "kitne",
    "kitna",
    "kiska",
    "kiske",
    "kise",
    "tha",
    "thi",
    "hoga",
    "hogi",
    "honge",
    "kon",
    "kisne",
    "kis",
    "hui",
    "nahi",
    "kaun",
    "kaunsa",
    "kaunsi",
    "kaunse",
    "aap",
    "tum",
    "mujhe",
    "hum",
    "inka",
    "unka",
    "tumhara",
    "mera",
    "yaha",
    "waha",
    "ke",
  ];
  const regex = new RegExp(`\\b(${hindiWords.join("|")})\\b`, "i");
  const hasDevanagariChars = /[\u0900-\u097F]/.test(args);

  return regex.test(args) || hasDevanagariChars;
}
let currentRoute;

generatBtn.addEventListener("click", generateNote);

function generateNote() {
  currentRoute = "https://sticky-note-backend.onrender.com/generate-note";
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
  let prompt;

  switch (subject) {
    case "Math":
      prompt = `You are an expert mathematics teacher for Class ${standard} (Bihar Board, 2025). Give the correct and updated answer to the following question in a short, precise, and one-line format that is easy to understand. Avoid extra explanation, examples, or technical complexity.

          Q: ${noteTopic.value.toUpperCase()}`;
      break;
    case "Science":
      prompt = `"prompt": "You are an expert teacher for Class ${standard} Science (Bihar Board, 2025). Give the correct and updated answer for this question in just one line. Avoid extra explanation.\n\nQ: ${noteTopic.value.toUpperCase()}`;
      break;
    case "Arts":
      prompt = `You are an expert teacher for Class ${standard} Arts (Bihar Board, 2025). Give the correct and updated answer to the following question in a short, precise, and one-line format that is easy to understand. Avoid extra explanation or complex language.

          Q: ${noteTopic.value.toUpperCase()}`;
      break;
    case "Computer":
      prompt = `You are an expert teacher for Class ${standard} Computer (CBSE,2025).Give the correct and updated answer to the following question in a short, precise, and one-line format that is easy to understand. Avoid extra explanation or complex language.
          Question: ${noteTopic.value.toUpperCase()}
    `;
      break;
    default:
      prompt = `You are a highly knowledgeable and student-friendly teacher for Class 10 and 11 and 12 students (Bihar Board, 2025). The student has asked a question but not selected any subject. Identify the subject automatically and give the correct and updated answer in just one line. Avoid complex language and unnecessary explanation. Avoid to mention subject in response.

          Q: ${noteTopic.value.toUpperCase()}`;
      break;
  }
  if (isHinglish(prompt)) {
    console.log(isHinglish(prompt));
    currentRoute = "https://sticky-note-backend.onrender.com/gemini-note";
  }

  fetch(currentRoute, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then(async (res) => {
      if (!res.ok) {
        console.warn("⚠️ Gemini failed. Switching to Cohere...");
        return fetch("https://sticky-note-backend.onrender.com/generate-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
      }
      return res;
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("🟨 Sticky Note:", data.text);

      createAiNotes(noteTopic.value.toLowerCase(), data.text);
      document.getElementById("loadingSpinner").style.display = "none";

      displayAiNotes();
    })
    .catch((err) => console.error("⚠️ Error:", err));
}
