import { useState } from "react";
import Registration from "./Pages/Registration.jsx";
import StudentProfile_23CSE0783 from "./Pages/StudentProfile_23CSE0783.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("registration");
  const pages = [
    { id: "registration", label: "Registration" },
    { id: "profile1", label: "Student 1" },
    { id: "profile2", label: "Student 2" },
    { id: "profile3", label: "Student 3" },
    { id: "profile4", label: "Student 4" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <nav
        aria-label="Main navigation"
        className="flex flex-wrap justify-center gap-2 bg-blue-900 p-3 sm:gap-3 sm:p-4"
      >
        {pages.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-current={currentPage === id ? "page" : undefined}
            onClick={() => setCurrentPage(id)}
            className={`rounded-md px-4 py-2.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              currentPage === id
                ? "bg-blue-100 text-blue-950"
                : "bg-white text-blue-900 hover:bg-blue-100"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="flex flex-1 flex-col">
        {currentPage === "registration" ? (
          <Registration />
        ) : currentPage === "profile1" ? (
          <StudentProfile_23CSE0783 />
        ) : (
          <section className="m-auto w-full max-w-xl px-5 py-12 text-center">
            <div className="rounded-xl bg-white p-8 shadow-md">
              <h1 className="text-2xl font-bold text-blue-900">
                Student {currentPage.slice(-1)} profile
              </h1>
              <p className="mt-3 text-slate-600">
                This student profile has not been added yet.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;