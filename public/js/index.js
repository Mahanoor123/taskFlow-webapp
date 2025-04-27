import { auth, addDoc, collection, db, serverTimestamp } from "../js/firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".tab-link");
  const contents = document.querySelectorAll(".tab-content");

  links.forEach((link) => {
    link.addEventListener("click", function () {
      const target = this.getAttribute("data-target");

      links.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      contents.forEach((content) => content.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });
});

const boardContainer = document.querySelector(".board-container");
const boardNameInput = document.getElementById("boardNameInput");
const addBoardButton = document.getElementById("addBoardButton");

const createBoard = async (boardName) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const boardData = {
      userId: user.uid,
      boardName: boardName,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "boards"), boardData);
    console.log("Board created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

// New function to render board in DOM
function renderBoard(boardName) {
  const boardDiv = document.createElement("div");
  boardDiv.classList.add("board");

  boardDiv.innerHTML = `
    <input type="text" value="${boardName}" readonly class="board-name">
    <i class="fa-solid fa-pen edit-board"></i>
    <i class="fa-solid fa-trash delete-board"></i>
  `;

  // Attach listeners for edit and delete
  const boardNameInput = boardDiv.querySelector(".board-name");
  const editIcon = boardDiv.querySelector(".edit-board");
  const deleteIcon = boardDiv.querySelector(".delete-board");

  let isEditing = false;

  editIcon.addEventListener("click", function () {
    if (isEditing) {
      // Save updated name
      const newBoardName = boardNameInput.value.trim();
      if (newBoardName) {
        boardNameInput.setAttribute("readonly", true);
        isEditing = false;
        editIcon.style.color = ""; // Reset color
        alert(`Board name updated to: ${newBoardName}`);
        // (Optional) Update board name in database here
      }
    } else {
      boardNameInput.removeAttribute("readonly");
      boardNameInput.focus();
      isEditing = true;
      editIcon.style.color = "green";
    }
  });

  deleteIcon.addEventListener("click", function () {
    const confirmDelete = confirm("Are you sure you want to delete this board?");
    if (confirmDelete) {
      boardDiv.remove();
      alert("Board deleted.");
      // (Optional) Delete from database if needed
    }
  });

  boardContainer.appendChild(boardDiv);
}

// Create board button click
addBoardButton.addEventListener("click", async () => {
  const boardName = boardNameInput.value.trim();
  if (!boardName) {
    alert("Please enter a board name.");
    return;
  }

  try {
    const boardId = await createBoard(boardName);
    renderBoard(boardName); // After successful creation, show it
    boardNameInput.value = ""; // Clear input
  } catch (error) {
    console.error(error);
  }
});

const openBoardPopup = () => {
  boardContainer.style.display = "block";
};

document.querySelector(".add-board").addEventListener("click", openBoardPopup);


const addTask = () => {
    window.location.href = './public/html/task.html';
}




document.querySelector(".add-task").addEventListener("click", addTask);