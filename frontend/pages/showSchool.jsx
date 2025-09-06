import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../pages/showSchool.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ShowSchools() {
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE}/api/schools`).then((res) => {
            setSchools(res.data);
        });
    }, []);

    return (
        <div className="school-page">
            <div className="top-bar">
                <h2>Schools List</h2>
                <Link to="/add">
                    <button className="add-btn">+ Add School</button>
                </Link>
            </div>

            <div className="grid-container">
                {schools.map((school) => (
                    <div key={school.id} className="card">
                        <div className="card-img">
                            <img src={school.image} alt={school.name} />
                        </div>
                        <div className="card-body">
                            <h3>{school.name}</h3>
                            <p className="address">{school.address}</p>
                            <p className="city">{school.city}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShowSchools;
// file
