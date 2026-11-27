import { useState } from "react";

const initialForm = {
  sName: "",
  sId: "",
  email: "",
  role: "student",
  username: "",
  password: "",
};

const inputClassName =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-200";

function Registration() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setStatus({ type: "", message: "" });
  };

  const submitRegistration = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/Student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: result.message || "Registration failed. Please try again.",
        });
        return;
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: result.message || "Registration completed successfully.",
      });
    } catch (error) {
      console.error("Registration request failed", error);
      setStatus({
        type: "error",
        message: "Could not connect to the registration service. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/10">
        <div className="bg-blue-900 px-6 py-7 text-white sm:px-9">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
            Student Management System
          </p>
          <h1 className="mt-2 text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-blue-100">
            Enter your details to register as a student or lecturer.
          </p>
        </div>

        <form className="space-y-5 p-6 sm:p-9" onSubmit={submitRegistration}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Full name
              <input
                autoComplete="name"
                className={inputClassName}
                maxLength={100}
                name="sName"
                onChange={updateField}
                placeholder="Your full name"
                required
                value={form.sName}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Student or staff ID
              <input
                className={inputClassName}
                name="sId"
                onChange={updateField}
                pattern="[A-Za-z][0-9]{3,8}"
                placeholder="e.g. S12345"
                required
                title="Use a letter followed by 3 to 8 digits."
                value={form.sId}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input
                autoComplete="email"
                className={inputClassName}
                name="email"
                onChange={updateField}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Account type
              <select
                className={inputClassName}
                name="role"
                onChange={updateField}
                value={form.role}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Username
              <input
                autoComplete="username"
                className={inputClassName}
                maxLength={20}
                minLength={4}
                name="username"
                onChange={updateField}
                pattern="[A-Za-z0-9._-]{4,20}"
                placeholder="Choose a username"
                required
                title="Use 4 to 20 letters, numbers, dots, underscores, or dashes."
                value={form.username}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                autoComplete="new-password"
                className={inputClassName}
                minLength={8}
                name="password"
                onChange={updateField}
                pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}"
                placeholder="At least 8 characters"
                required
                title="Use at least 8 characters, including a letter and a number."
                type="password"
                value={form.password}
              />
            </label>
          </div>

          <p className="text-sm text-slate-500">
            Passwords must contain at least 8 characters, including a letter and
            a number.
          </p>

          {status.message && (
            <p
              aria-live="polite"
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-red-50 text-red-800"
              }`}
              role={status.type === "error" ? "alert" : "status"}
            >
              {status.message}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Registering..." : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Registration;
