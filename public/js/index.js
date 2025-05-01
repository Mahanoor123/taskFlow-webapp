import {
  auth,
  addDoc,
  getDocs,
  signOut,
  collection,
  db,
  doc,
  serverTimestamp,
  onAuthStateChanged,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "../js/firebase-config.js";

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

/********************* Utility: Toaster *********************/

function showToast(message, type = "info", options = {}) {
  const { duration = 4000, position = "center" } = options;

  const containerId = `toast-container-${position}`;
  let toastContainer = document.getElementById(containerId);

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = containerId;
    toastContainer.className = `toast-container ${position}`;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);
  toast.innerHTML = `
    <span class="toast-icon">${getIcon(type)}</span>
    <span class="toast-message">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">×</span>
    <div class="toast-progress" style="animation-duration:${duration}ms"></div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

function getIcon(type) {
  switch (type) {
    case "success":
      return "✅";
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    case "info":
    default:
      return "ℹ️";
  }
}

/********************* Utility: Loader *********************/
const showModernLoader = () =>
  document.getElementById("modernLoader").classList.remove("hidden");
const hideModernLoader = () =>
  document.getElementById("modernLoader").classList.add("hidden");

/********************* Utility: User Check *********************/

const loginBtn = document.querySelector(".login");
const signupBtn = document.querySelector(".signup");
const logoutBtn = document.querySelector(".logout");
const profileBtn = document.querySelector(".fa-user");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    localStorage.setItem("currentUserId", user.uid);

    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (profileBtn) profileBtn.style.display = "flex";
    if (logoutBtn) logoutBtn.style.display = "flex";
  } else {
    localStorage.clear();
    if (loginBtn) loginBtn.style.display = "flex";
    if (signupBtn) signupBtn.style.display = "flex";
    if (profileBtn) profileBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});

const signOutUser = async () => {
  try {
    const confirmLogout = confirm("Are you sure to logout?");
    if (confirmLogout) {
      await signOut(auth);
      showToast("You are logout successfully");
      window.location.href = "/index.html";
    }
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

logoutBtn.addEventListener("click", signOutUser);

/********************* Task Show and drag/drop functionality *********************/

document.querySelector(".add-task").addEventListener("click", () => {
  const user = auth.currentUser;
  if(user){
    window.location.href = "./public/html/task.html";
  }
  else{
    showToast("You need to login to add task");
  }
});

const fetchAllTasks = async () => {
  try {
    showModernLoader();

    const taskRef = collection(db, "tasks");

    onSnapshot(taskRef, (snapshot) => {
      document
        .getElementById("to-do")
        .querySelector(".task-container").innerHTML = "";
      document
        .getElementById("in-progress")
        .querySelector(".task-container").innerHTML = "";
      document
        .getElementById("completed")
        .querySelector(".task-container").innerHTML = "";

      snapshot.forEach((doc) => {
        const task = doc.data();
        task.id = doc.id;
        displayTask(task);
        hideModernLoader();
      });
    });
  } catch (error) {
    console.error("Error fetching tasks", error);
  }
};

const displayTask = (task) => {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card");
  taskCard.setAttribute("draggable", "true");
  taskCard.setAttribute("id", task.id);
  taskCard.addEventListener("dragstart", drag);

  taskCard.innerHTML = `
    <i class="fa-solid fa-pen"></i>
    <i class="fa-solid fa-trash"></i>
    <h1 class="title">${task.title}</h1>
    <p class="description">${task.description}</p>
    <button class="task-status">${task.status}</button>
  `;

  taskCard.addEventListener("dragstart", drag);

  const container = document.getElementById(task.status);
  if (container) {
    container.querySelector(".task-container").appendChild(taskCard);
  } else {
    console.warn(`No column found for status: ${task.status}`);
  }
  

  taskCard
    .querySelector(".fa-pen")
    .addEventListener("click", () => editTask(task));
  taskCard
    .querySelector(".fa-trash")
    .addEventListener("click", () => deleteTask(task));
};

window.addEventListener("DOMContentLoaded", fetchAllTasks);

const editTask = (task) => {
  localStorage.setItem("editMode", true);
  localStorage.setItem("editTaskId", task.id);
  window.location.href = "./public/html/task.html";
};

const deleteTask = async (task) => {
  try {
    const taskRef = doc(db, "tasks", task.id);
    await deleteDoc(taskRef);
    showToast("Task deleted successfully");

    window.location.reload();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  console.log("Dragging", ev.target.id);

  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const taskId = ev.dataTransfer.getData("text");
  const newStatus = ev.currentTarget.getAttribute("data-status");
  console.log("Dropping", taskId, "into", newStatus);

  const taskCard = document.getElementById(taskId);
  ev.currentTarget.appendChild(taskCard);

  updateTaskStatus(taskId, newStatus);
}

function updateTaskStatus(taskId, newStatus) {
  const taskRef = doc(db, "tasks", taskId);
  updateDoc(taskRef, {
    status: newStatus,
  })
    .then(() => console.log("Status updated!"))
    .catch((err) => console.error("Update error", err));
}

window.allowDrop = allowDrop;
window.drag = drag;
window.drop = drop;
