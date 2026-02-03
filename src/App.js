/*
// src/App.js
import { useState } from "react";
import { signup } from "./auth";
import TaskList from "./TaskList";

function App() {
  const [user, setUser] = useState(null); // logged-in user

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("manager"); // manager default
  const [companyId, setCompanyId] = useState(""); // company ID or name

  // Handle Sign Up button
  const handleSignup = async () => {
    console.log("Sign Up clicked!", { name, email, password, selectedRole, companyId });

    if (!name || !email || !password || !companyId) {
      alert("Fill all fields!");
      return;
    }

    try {
      const uid = await signup(name, email, password, selectedRole, companyId);
      console.log("User created with UID:", uid);

      // Save user in state to show TaskList
      setUser({
        uid,
        name,
        email,
        role: selectedRole,
        companyId,
      });
    } catch (err) {
      console.error("Signup error:", err.message);
      alert("Error: " + err.message);
    }
  };

  // If user is logged in, show TaskList
  if (user) return <TaskList user={user} />;

  // Otherwise, show signup form
  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Sign Up</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
      </select>

      <input
        placeholder={selectedRole === "manager" ? "New Company Name" : "Company ID"}
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleSignup}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#7b2ff7",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default App;

*/



// src/App.js
import TaskList from "./TaskList";

function App() {
  // Fake user for testing
  const user = {
    role: "manager",     // try "employee" too
    companyId: "TestCo", // any string for testing
  };

  return (
    <div>
      <TaskList user={user} />
    </div>
  );
}

export default App;
