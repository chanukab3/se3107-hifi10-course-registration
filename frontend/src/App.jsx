import { useState } from "react";
import "tailwindcss";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function App() {
  const [sName, setStudentName] = useState("");
  const [sId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("Submitting registration...");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/Student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sName, sId, email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage(data.message);
      setStudentName("");
      setStudentId("");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#2e2937] p-5">
      <section className="box-border w-full max-w-125 rounded-2xl bg-slate-800 p-10 font-sans text-slate-50 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.4),0_10px_10px_-5px_rgba(0,0,0,0.4)]">
        <h1 className="mb-8 mt-0 text-center text-[28px] font-bold text-white">
          Student Registration
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="student-name" className="mb-2 text-[15px] font-medium text-slate-400">Student Name</label>
          <input
            id="student-name"
            className="mb-6 box-border w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3.5 text-base text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60"
            value={sName}
            onChange={(e) => setStudentName(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="John Doe"
          />

          <label htmlFor="student-id" className="mb-2 text-[15px] font-medium text-slate-400">Student ID</label>
          <input
            id="student-id"
            className="mb-6 box-border w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3.5 text-base text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60"
            value={sId}
            onChange={(e) => setStudentId(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="B12345"
          />

          <label htmlFor="student-email" className="mb-2 text-[15px] font-medium text-slate-400">Email Address</label>
          <input
            id="student-email"
            className="mb-6 box-border w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3.5 text-base text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="john@university.edu"
          />

          <button
            type="submit"
            className="mt-2 w-full cursor-pointer rounded-lg border-0 bg-blue-600 p-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Student"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-[15px] font-medium text-sky-400" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

export default App;