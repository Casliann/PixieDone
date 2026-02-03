// src/TaskList.js
import "./TaskList.css";
import { useEffect, useState } from "react";

import { db } from "./firebase";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const isManager = user.role === "manager";

  // -------------------------------
  // ✅ 1. Load Tasks (Newest First)
  // -------------------------------
  useEffect(() => {
    if (!user.companyId) return;

    const tasksCol = collection(db, "companies", user.companyId, "tasks");

    const q = query(tasksCol, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, [user.companyId]);

  // -------------------------------
  // ✅ 2. Mark Task Done
  // -------------------------------
  const markDone = async (taskId) => {
    const taskRef = doc(db, "companies", user.companyId, "tasks", taskId);

    await updateDoc(taskRef, {
      status: "done",
    });

    console.log("Task marked done:", taskId);
  };

  // -------------------------------
  // ✅ 3. Add Task (Manager Only)
  // -------------------------------
  const addTask = async () => {
    if (!isManager) return;

    if (newTaskTitle.trim() === "") return;

    await addDoc(collection(db, "companies", user.companyId, "tasks"), {
      title: newTaskTitle,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    console.log("Task added:", newTaskTitle);

    setNewTaskTitle("");
  };

  // -------------------------------
  // ✅ Helper: Mark First Pending Task Done
  // -------------------------------
  const markFirstPendingTaskDone = () => {
    const pendingTask = tasks.find((t) => t.status !== "done");

    if (pendingTask) {
      markDone(pendingTask.id);
    } else {
      console.log("No pending tasks left!");
    }
  };

  // -------------------------------
  // ✅ 4. Voice Recognition: "Done Pixie"
  // -------------------------------
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Speech Recognition NOT supported in this browser.");
      return;
    }

    console.log("Requesting microphone permission...");

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log("Microphone permission granted ✅");

        const recognition = new window.webkitSpeechRecognition();

        recognition.continuous = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript =
            event.results[event.results.length - 1][0].transcript.trim();

          console.log("Heard:", transcript);

          if (transcript.toLowerCase() === "done pixie") {
            console.log("VOICE COMMAND DETECTED 🎤");
            markFirstPendingTaskDone();
          }
        };

        recognition.onerror = (err) => {
          console.error("Speech recognition error:", err);
        };

        recognition.start();
        console.log("Voice recognition started 🎙️");

        return () => recognition.stop();
      })
      .catch((err) => {
        console.error("Microphone denied ❌", err);
      });
  }, [tasks]);

  // -------------------------------
  // ✅ 5. Desktop Notifications
  // -------------------------------
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const unsubscribe = onSnapshot(
      collection(db, "companies", user.companyId, "tasks"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const task = change.doc.data();

            if (Notification.permission === "granted") {
              new Notification("📌 New Task Added!", {
                body: task.title,
              });
            }
          }
        });
      }
    );

    return () => unsubscribe();
  }, [user.companyId]);

  // -------------------------------
  // ✅ UI Render
  // -------------------------------
  return (
    <div className="tasklist-container">
      <h2 className="tasklist-header">PixieDone Tasks</h2>

      {/* Manager Add Form */}
      {isManager && (
        <div className="tasklist-form">
          <input
            type="text"
            placeholder="New task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="tasklist-input"
          />

          <button onClick={addTask} className="tasklist-add-btn">
            Add
          </button>
        </div>
      )}

      {/* Task List */}
      <ul className="tasklist-ul">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.status}`}>
            <span className="task-title">{task.title}</span>

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

      <p style={{ marginTop: "15px", fontSize: "0.9rem", opacity: 0.7 }}>
        🎤 Say: <b>"Done Pixie"</b> to complete the next task
      </p>
    </div>
  );
}
