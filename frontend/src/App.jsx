import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const initialValues = {
  name: "",
  uid: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: ""
};

const fieldClassName =
  "w-full rounded-xl border border-[#46587a] bg-[#334259] px-5 py-[18px] text-[1.05rem] text-white placeholder:text-[#8794ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fa6ff] aria-[invalid=true]:border-[#ff8a8a] disabled:opacity-60";

function App() {
  const [role, setRole] = useState("student");
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setMessage("");
  }

  function validate() {
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );
    const nextErrors = {
      name: trimmed.name.length < 2 ? "Enter your full name." : "",
      uid: /^[A-Za-z]\d{3,8}$/.test(trimmed.uid)
        ? ""
        : `Use a letter followed by 3–8 digits, like ${role === "student" ? "B12345." : "L1234."}`,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)
        ? ""
        : "Enter a valid email address.",
      username: /^[A-Za-z0-9._-]{4,20}$/.test(trimmed.username)
        ? ""
        : "Use 4–20 letters, numbers, dots or dashes.",
      password:
        trimmed.password.length >= 8 &&
        /[A-Za-z]/.test(trimmed.password) &&
        /\d/.test(trimmed.password)
          ? ""
          : "Use 8+ characters with letters and numbers.",
      confirmPassword:
        trimmed.confirmPassword && trimmed.confirmPassword === trimmed.password
          ? ""
          : "Passwords don’t match."
    };

    setErrors(nextErrors);
    const firstInvalidField = Object.keys(nextErrors).find((field) => nextErrors[field]);
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return null;
    }

    return trimmed;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const formValues = validate();
    if (!formValues) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          sName: formValues.name,
          sId: formValues.uid,
          email: formValues.email,
          username: formValues.username,
          password: formValues.password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess({
        message: data.message || "Registration complete.",
        email: formValues.email,
        username: formValues.username
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function togglePasswordVisibility(field) {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  }

  const isStudent = role === "student";
  const registrationTitle = `${isStudent ? "Student" : "Lecturer"} Registration`;

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#2e2a36] px-4 pb-10 pt-10 font-[Segoe_UI,system-ui,-apple-system,Roboto,Arial,sans-serif] text-white">
      <section className="box-border w-full max-w-172.5 rounded-[22px] bg-[#1d283d] px-13.5 py-12 shadow-[0_20px_40px_rgba(0,0,0,0.35)] max-[600px]:px-5.5 max-[600px]:py-8.5">
        {success ? (
          <div className="py-5 text-center" role="status">
            <h1 className="mb-0 mt-0 text-[2rem] font-bold max-[600px]:text-[1.6rem]">
              You’re registered
            </h1>
            <p className="leading-6 text-[#93a0b8]">
              <strong className="text-[#5fd4a0]">{success.message}</strong>
              <br />
              Registration email: {success.email}.
              <br />
              Your username is {success.username}.
            </p>
            <p className="mb-0 mt-6 text-center text-[.95rem] text-[#93a0b8]">
              <a className="font-semibold text-[#8fb0ff] hover:underline" href="#login">
                Go to log in
              </a>
            </p>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit}>
            <h1 className="mb-8.5 mt-0 text-center text-[2rem] font-bold max-[600px]:text-[1.6rem]">
              {registrationTitle}
            </h1>

            <div
              className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-[#334259] p-1.25"
              role="group"
              aria-label="I am a"
            >
              {["student", "lecturer"].map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={role === option}
                  onClick={() => {
                    setRole(option);
                    setMessage("");
                    setErrors({});
                  }}
                  className={`cursor-pointer rounded-[9px] border-0 px-3 py-2.75 font-semibold capitalize text-[#8fa3c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fa6ff] ${
                    role === option ? "bg-[#1a5cff] text-white" : "bg-transparent"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mb-5.5">
              <label htmlFor="name" className="mb-2.25 block text-base font-semibold text-[#8fa3c4]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                className={fieldClassName}
                value={values.name}
                onChange={updateField}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              <p id="name-error" className="mx-0.5 mb-0 mt-1.75 min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                {errors.name}
              </p>
            </div>

            <div className="mb-5.5">
              <label htmlFor="uid" className="mb-2.25 block text-base font-semibold text-[#8fa3c4]">
                {isStudent ? "Student ID" : "Staff ID"}
              </label>
              <input
                id="uid"
                name="uid"
                autoComplete="off"
                placeholder={isStudent ? "B12345" : "L1234"}
                className={fieldClassName}
                value={values.uid}
                onChange={updateField}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.uid)}
                aria-describedby={errors.uid ? "uid-error" : undefined}
              />
              <p id="uid-error" className="mx-0.5 mb-0 mt-1.75 min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                {errors.uid}
              </p>
            </div>

            <div className="mb-5.5">
              <label htmlFor="email" className="mb-2.25 block text-base font-semibold text-[#8fa3c4]">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john@university.edu"
                className={fieldClassName}
                value={values.email}
                onChange={updateField}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : "email-hint"}
              />
              <p id="email-hint" className="mx-0.5 mb-0 mt-1.75 text-[.85rem] text-[#93a0b8]">
                Use an email address you can access.
              </p>
              <p id="email-error" className="mx-0.5 mb-0 mt-1.75 min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                {errors.email}
              </p>
            </div>

            <div className="mb-5.5">
              <label htmlFor="username" className="mb-2.25 block text-base font-semibold text-[#8fa3c4]">
                Username
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="johndoe"
                className={fieldClassName}
                value={values.username}
                onChange={updateField}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              <p id="username-error" className="mx-0.5 mb-0 mt-1.75 min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                {errors.username}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4.5 max-[600px]:grid-cols-1 max-[600px]:gap-0">
              {[
                { field: "password", label: "Password", placeholder: "At least 8 characters" },
                { field: "confirmPassword", label: "Confirm Password", placeholder: "Repeat password" }
              ].map(({ field, label, placeholder }) => (
                <div key={field} className="mb-5.5">
                  <label htmlFor={field} className="mb-2.25 block text-base font-semibold text-[#8fa3c4]">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={field}
                      name={field}
                      type={visiblePasswords[field] ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={placeholder}
                      className={`${fieldClassName} pr-19`}
                      value={values[field]}
                      onChange={updateField}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors[field])}
                      aria-describedby={errors[field] ? `${field}-error` : undefined}
                    />
                    <button
                      type="button"
                      aria-label={`${visiblePasswords[field] ? "Hide" : "Show"} ${label.toLowerCase()}`}
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent px-2.5 py-2 text-[.9rem] font-semibold text-[#8fa3c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fa6ff]"
                    >
                      {visiblePasswords[field] ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p id={`${field}-error`} className="mx-0.5 mb-0 mt-1.75 min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                    {errors[field]}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2.5 w-full cursor-pointer rounded-xl border-0 bg-[#1a5cff] p-4.75 text-[1.1rem] font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fa6ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Registering..." : `Register ${isStudent ? "Student" : "Lecturer"}`}
            </button>

            {message && (
              <p className="mb-0 mt-4 text-center text-[.95rem] text-[#ff8a8a]" role="alert" aria-live="polite">
                {message}
              </p>
            )}

            <p className="mb-0 mt-6 text-center text-[.95rem] text-[#93a0b8]">
              Already registered?{" "}
              <a className="font-semibold text-[#8fb0ff] hover:underline" href="#login">
                Log in
              </a>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}

export default App;
