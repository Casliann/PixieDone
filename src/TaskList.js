// src/TaskList.js
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
    <div style={{ maxWidth: "500px", margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#7b2ff7" }}>Tasks</h2>

      <div style={{ display: "flex", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ flex: 1, padding: "8px", fontSize: "16px" }}
        />
        <button
          onClick={addTask}
          style={{
            marginLeft: "10px",
            padding: "8px 12px",
            backgroundColor: "#7b2ff7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              marginBottom: "8px",
              backgroundColor: task.status === "done" ? "#d3ffd3" : "#f0f0f0",
              borderRadius: "5px"
            }}
          >
            <span>{task.title}</span>
            {task.status !== "done" && (
              <button
                onClick={() => markDone(task.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#7b2ff7",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
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
