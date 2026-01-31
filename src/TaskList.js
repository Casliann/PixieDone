// src/TaskList.js
import './TaskList.css';
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Listen to Firestore tasks collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // Mark a task as done
  const markDone = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: "done" });
  };

  // Add a new task
  const addTask = async () => {
    if (newTaskTitle.trim() === "") return;
    await addDoc(collection(db, "tasks"), { title: newTaskTitle, status: "pending" });
    setNewTaskTitle(""); // clear input
  };

  // THIS IS WHERE YOUR <div> GOES — JSX RETURN
  return (
  <div className="tasklist-container">
    <h2 className="tasklist-header">Tasks</h2>

    <div className="tasklist-form">
      <input
        type="text"
        placeholder="New task title"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        className="tasklist-input"
      />
      <button onClick={addTask} className="tasklist-add-btn">
        Add
      </button>
    </div>

    <ul className="tasklist-ul">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.status}`}>
          <span>{task.title}</span>
          {task.status !== "done" && (
            <button
              onClick={() => markDone(task.id)}
              className="task-done-btn"
            >
              Done
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>
);
}
