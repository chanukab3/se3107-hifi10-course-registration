import { useState } from "react";

import Registration from "./pages/registration.jsx";
import StudentProfile_23CSE0783 from "./pages/StudentProfile_23CSE0783.jsx";
// import StudentProfile2 from "./pages/StudentProfile_2";
// import StudentProfile3 from "./pages/StudentProfile_3";
// import StudentProfile4 from "./pages/StudentProfile_4";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "profile1":
        return <StudentProfile_23CSE0783 />;

      // case "profile2":
      //   return <StudentProfile2 />;

      // case "profile3":
      //   return <StudentProfile3 />;

      // case "profile4":
      //   return <StudentProfile4 />;

      default:
        return <Registration />;
    }
  };

  return (
    <div>
      <nav className="navigation">
        <button onClick={() => setCurrentPage("home")}>
          Registration
        </button>

        <button onClick={() => setCurrentPage("profile1")}>
          Student 1
        </button>

        <button onClick={() => setCurrentPage("profile2")}>
          Student 2
        </button>

        <button onClick={() => setCurrentPage("profile3")}>
          Student 3
        </button>

        <button onClick={() => setCurrentPage("profile4")}>
          Student 4
        </button>
      </nav>

      {renderPage()}
    </div>
  );
}

export default App;