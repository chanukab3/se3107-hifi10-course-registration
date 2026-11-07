import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const initialValues = {
  name: "",
  uid: "",
  email: ""
};

const fieldClassName =
  "w-full rounded-xl border border-[#46587a] bg-[#334259] px-5 py-[18px] text-[1.05rem] text-white placeholder:text-[#8794ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fa6ff] aria-[invalid=true]:border-[#ff8a8a] disabled:opacity-60";

function App() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

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
        : "Use a letter followed by 3–8 digits, like B12345.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)
        ? ""
        : "Enter a valid email address."
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
    const student = validate();
    if (!student) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sName: student.name,
          sId: student.uid,
          email: student.email
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setRegisteredEmail(student.email);
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

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#2e2a36] px-4 pb-10 pt-10 font-[Segoe_UI,system-ui,-apple-system,Roboto,Arial,sans-serif] text-white">
      <section className="box-border w-full max-w-[690px] rounded-[22px] bg-[#1d283d] px-[54px] py-12 shadow-[0_20px_40px_rgba(0,0,0,0.35)] max-[600px]:px-[22px] max-[600px]:py-[34px]">
        {registeredEmail ? (
          <div className="py-5 text-center" role="status">
            <h1 className="mb-0 mt-0 text-[2rem] font-bold max-[600px]:text-[1.6rem]">
              Registration complete
            </h1>
            <p className="leading-6 text-[#93a0b8]">
              <strong className="text-[#5fd4a0]">Student registered successfully.</strong>
              <br />
              The student record is associated with {registeredEmail}.
            </p>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit}>
            <h1 className="mb-[34px] mt-0 text-center text-[2rem] font-bold max-[600px]:text-[1.6rem]">
              Student Registration
            </h1>

            <div className="mb-[22px]">
              <label htmlFor="name" className="mb-[9px] block text-base font-semibold text-[#8fa3c4]">
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
              <p id="name-error" className="mx-0.5 mb-0 mt-[7px] min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                {errors.name}
              </p>
            </div>

            <div className="mb-[22px]">
              <label htmlFor="uid" className="mb-[9px] block text-base font-semibold text-[#8fa3c4]">
                Student ID
              </label>
              <input
                id="uid"
                name="uid"
                autoComplete="off"
                placeholder="B12345"
                className={fieldClassName}
                value={values.uid}
                onChange={updateField}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.uid)}
                aria-describedby={errors.uid ? "uid-error" : undefined}
              />
              <p id="uid-error" className="mx-0.5 mb-0 mt-[7px] min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                {errors.uid}
              </p>
            </div>

            <div className="mb-[22px]">
              <label htmlFor="email" className="mb-[9px] block text-base font-semibold text-[#8fa3c4]">
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
              <p id="email-hint" className="mx-0.5 mb-0 mt-[7px] text-[.85rem] text-[#93a0b8]">
                Registration updates are sent here.
              </p>
              <p id="email-error" className="mx-0.5 mb-0 mt-[7px] min-h-0 text-[.88rem] text-[#ff8a8a]" aria-live="polite">
                {errors.email}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[10px] w-full cursor-pointer rounded-xl border-0 bg-[#1a5cff] p-[19px] text-[1.1rem] font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fa6ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Registering..." : "Register Student"}
            </button>

            {message && (
              <p className="mb-0 mt-4 text-center text-[.95rem] text-[#ff8a8a]" role="alert" aria-live="polite">
                {message}
              </p>
            )}
          </form>
        )}
      </section>
    </main>
  );
}

export default App;
