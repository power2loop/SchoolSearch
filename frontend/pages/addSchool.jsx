import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./addSchool.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AddSchool() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            for (let key in data) {
                if (key === "image" && data.image?.[0]) {
                    formData.append("image", data.image[0]);
                } else {
                    formData.append(key, data[key]);
                }
            }

            await axios.post(`${API_BASE}/api/schools`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("School added successfully!");
            setIsError(false);
            reset();
        } catch (error) {
            console.error(error);
            setMessage("Error adding school");
            setIsError(true);
        }
    };

    const fields = [
        { name: "name", placeholder: "School Name", required: true },
        { name: "address", placeholder: "Address" },
        { name: "city", placeholder: "City" },
        { name: "state", placeholder: "State" },
        {
            name: "contact",
            placeholder: "Contact Number",
            required: true,
            pattern: { value: /^[0-9]{10}$/, message: "Contact must be a 10-digit number" }
        },
        {
            name: "email_id",
            placeholder: "Email",
            required: true,
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
        },
    ];

    return (
        <div className="page-container">
            <div className="form-container">
                <h2>Add School</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field) => (
                        <div key={field.name}>
                            <input
                                type={field.name === "email_id" ? "email" : "text"}
                                placeholder={field.placeholder}
                                {...register(field.name, {
                                    required: field.required && `${field.placeholder} is required`,
                                    pattern: field.pattern,
                                })}
                            />
                            {errors[field.name] && (
                                <span className="error">{errors[field.name].message}</span>
                            )}
                        </div>
                    ))}

                    <div>
                        <input
                            type="file"
                            {...register("image", { required: "School image is required" })}
                        />
                        {errors.image && <span className="error">{errors.image.message}</span>}
                    </div>

                    <div className="button-group">
                        <button type="submit">Add School</button>
                        <button type="button" onClick={() => navigate("/")}>
                            Go Home
                        </button>
                    </div>
                </form>

                {message && (
                    <p className={`msg ${isError ? "error" : "success"}`}>{message}</p>
                )}
            </div>
        </div>
    );
}

export default AddSchool;
