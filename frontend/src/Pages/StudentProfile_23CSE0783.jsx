import "./StudentProfile_23CSE0783.css";

function StudentProfile_23CSE0783() {
  const student = {
    fullName: "Sample Student",
    address: "Sample Address",
    faculty: "Faculty of Computing",
    department: "Department of Software Engineering",
    indexNumber: "23CSE0783",
    university: "Sabaragamuwa University of Sri Lanka",
    dateOfBirth: "01 January 2000"
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Student Profile</h1>

        <div className="profile-details">
          <p>
            <strong>Full Name:</strong>
            {student.fullName}
          </p>

          <p>
            <strong>Address:</strong>
            {student.address}
          </p>

          <p>
            <strong>Faculty:</strong>
            {student.faculty}
          </p>

          <p>
            <strong>Department:</strong>
            {student.department}
          </p>

          <p>
            <strong>Index Number:</strong>
            {student.indexNumber}
          </p>

          <p>
            <strong>University:</strong>
            {student.university}
          </p>

          <p>
            <strong>Date of Birth:</strong>
            {student.dateOfBirth}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile_23CSE0783;