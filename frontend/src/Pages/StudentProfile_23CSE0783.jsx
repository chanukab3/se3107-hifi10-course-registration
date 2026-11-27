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
    <div className="flex flex-1 items-center justify-center bg-slate-100 p-5 font-[Arial,sans-serif]">
      <div className="w-full max-w-[600px] rounded-xl bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.1)] sm:p-[30px]">
        <h1 className="mb-[25px] text-center text-2xl font-bold text-blue-900">
          Student Profile
        </h1>

        <div>
          <p className="border-b border-slate-200 p-3 text-slate-700">
            <strong className="inline-block w-[145px] text-blue-800">Full Name:</strong>{" "}
            {student.fullName}
          </p>

          <p className="border-b border-slate-200 p-3 text-slate-700">
            <strong className="inline-block w-[145px] text-blue-800">Address:</strong>{" "}
            {student.address}
          </p>

          <p className="border-b border-slate-200 p-3 text-slate-700">
            <strong className="inline-block w-[145px] text-blue-800">Faculty:</strong>{" "}
            {student.faculty}
          </p>

          <p className="border-b border-slate-200 p-3 text-slate-700">
            <strong className="inline-block w-[145px] text-blue-800">Department:</strong>{" "}
            {student.department}
          </p>

          <p className="border-b border-slate-200 p-3 text-slate-700">
            <strong className="inline-block w-[145px] text-blue-800">Index Number:</strong>{" "}
            {student.indexNumber}
          </p>

          <p className="border-b border-slate-200 p-3 text-slate-700">
            <strong className="inline-block w-[145px] text-blue-800">University:</strong>{" "}
            {student.university}
          </p>

          <p className="border-b border-slate-200 p-3 text-slate-700">
            <strong className="inline-block w-[145px] text-blue-800">Date of Birth:</strong>{" "}
            {student.dateOfBirth}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile_23CSE0783;