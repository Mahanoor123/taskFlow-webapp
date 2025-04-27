import { auth, addDoc, collection, db, serverTimestamp } from "../js/firebase-config.js";

const createTask = async (taskTitle, taskDescription) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const taskData = {
      userId: user.uid,
      title: taskTitle,
      description: taskDescription,
      status: "to-do", // default status
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "tasks"), taskData);
    console.log("Task created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

document.querySelector(".form-container").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const taskTitleInput = document.querySelector(".task-title");
    const taskDescriptionInput = document.querySelector(".task-desc");
  
    if (!taskTitleInput || !taskDescriptionInput) {
      console.error("Task title or description input not found in the DOM.");
      return;
    }
  
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
  
    if (!title) {
      alert("Task title is required.");
      return;
    }
  
    try {
      const taskId = await createTask(title, description);
      alert("Task created successfully! Task ID: " + taskId);
  
      // Clear form fields
      taskTitleInput.value = "";
      taskDescriptionInput.value = "";
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. See console for error details.");
    }
  });
  