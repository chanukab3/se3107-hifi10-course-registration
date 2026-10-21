import { useState } from 'react'

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("Student Name: " + name + "\nStudent Email: " + email+ "\nForm submitted successfully!");
  }

  return ( 
    <div className="bg-gray-200 p-4">
      <form className="bg-gray-100 p-4 rounded shadow-md m-5 d-flex flex-row justify-content-center align-items-center">
        <label htmlFor="name"> Name :</label>
        <input 
          type="text"
          placeholder="Enter your name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <label htmlFor="email"> Email :</label>
        <input 
          type="email"
          placeholder="Enter your email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        /> 
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
   );
}

export default App;