import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddSchool from "../pages/addSchool";
import ShowSchools from "../pages/showSchool";
import "./App.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GiDatabase } from "react-icons/gi";

function Home() {
  return (
    <div className="home-container">
      <div className="box">
        <h1 className="home-title">Welcome!</h1>
        <div className="home-buttons">
          <Link to="/add">
            <button className="home-btn add-btn">
              <IoMdAddCircleOutline style={{ marginRight: "5px" }} />
              Add School
            </button>
          </Link>
          <Link to="/show">
            <button className="home-btn show-btn">
              <GiDatabase style={{ marginRight: "5px" }} />
              Show Schools
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Developed and Designed by Vikash kumar</p>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content">
          <Routes>
            <Route path="/add" element={<AddSchool />} />
            <Route path="/show" element={<ShowSchools />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
