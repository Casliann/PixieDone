// src/auth.js
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function signup(name, email, password, role, companyId) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

  // Automatically create user entry in Firestore
  await setDoc(doc(db, "users", uid), {
    name,
    email,
    role,       // "manager" or "employee"
    companyId,
    createdAt: serverTimestamp(),
  });

  return uid;
}
