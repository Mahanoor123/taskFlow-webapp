import {
  addDoc,
  getDoc,
  collection,
  doc,
  db,
  serverTimestamp,
  updateDoc,
} from "../js/firebase-config.js";

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

const taskTitleInput = document.querySelector(".task-title");
const taskDescriptionInput = document.querySelector(".task-desc");
const formHead = document.querySelector(".form-head");
const formBtn = document.querySelector(".primary_btn");

document
  .querySelector(".form-container")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const isEditMode = localStorage.getItem("editMode");
    const editTaskId = localStorage.getItem("editTaskId");
    const currentUserId = localStorage.getItem("currentUserId");

    if (!taskTitleInput || !taskDescriptionInput) {
      console.error("Task title or description input not found in the DOM.");
      return;
    }

    const taskData = {
      userId: currentUserId,
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      status: "to-do",
    };

    try {
      if (isEditMode && editTaskId) {
        const taskRef = doc(db, "tasks", editTaskId);
        taskData.updatedAt = serverTimestamp();
        await updateDoc(taskRef, taskData);
        showToast("Task updated successfully!");
      } else {
        taskData.createdAt = serverTimestamp();
        await addDoc(collection(db, "tasks"), taskData);
        showToast("Task created successfully!");
      }
      localStorage.removeItem("editMode");
      localStorage.removeItem("editTaskId");
      taskTitleInput.value = "";
      taskDescriptionInput.value = "";
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. See console for error details.");
    }
  });

window.addEventListener("DOMContentLoaded", async () => {
  const isEditMode = localStorage.getItem("editMode");
  const editTaskId = localStorage.getItem("editTaskId");

  if (isEditMode && editTaskId) {
    const taskRef = doc(db, "tasks", editTaskId);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const taskData = taskSnap.data();
      console.log(taskData);

      taskTitleInput.value = taskData?.title;
      taskDescriptionInput.value = taskData?.description;
      formHead.textContent = "Update Task";
      formBtn.textContent = "Update";
    }
  }
});
