import { useEffect, useState } from "react";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";

export default function Home() {
  const { user } = useAuth();
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setStatus(`API ${res.data.status}, database ${res.data.db}`))
      .catch(() => setStatus("API unreachable"));
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold">
        {user ? `Welcome back, ${user.username}` : "Welcome to CyberConnect"}
      </h1>
      <p className="mt-2 text-slate-400">
        A community for cybersecurity writing and discussion.
      </p>
      <p className="mt-6 text-sm text-emerald-400">{status}</p>
    </section>
  );
}