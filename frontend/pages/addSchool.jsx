import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import "../pages/addSchool.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AddSchool() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [message, setMessage] = useState("");

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            for (let key in data) {
                if (key === "image") {
                    formData.append("image", data.image[0]);
                } else {
                    formData.append(key, data[key]);
                }
            }

            await axios.post(`${API_BASE}/api/schools`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("School added successfully!");
            reset();
        } catch (error) {
            console.error(error);
            setMessage("Error adding school");
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <h2>Add School</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="School Name"
                        {...register("name", { required: "School name is required" })}
                    />
                    {errors.name && <span className="error">{errors.name.message}</span>}

                    <input type="text" placeholder="Address" {...register("address")} />

                    <input type="text" placeholder="City" {...register("city")} />

                    <input type="text" placeholder="State" {...register("state")} />

                    <input
                        type="text"
                        placeholder="Contact Number"
                        {...register("contact", {
                            required: "Contact number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Contact must be a 10-digit number",
                            },
                        })}
                    />
                    {errors.contact && <span className="error">{errors.contact.message}</span>}

                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email_id", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format",
                            },
                        })}
                    />
                    {errors.email_id && <span className="error">{errors.email_id.message}</span>}

                    <input
                        type="file"
                        {...register("image", { required: "School image is required" })}
                    />
                    {errors.image && <span className="error">{errors.image.message}</span>}

                    <button type="submit">Add School</button>
                    <button type="button" onClick={() => window.location.href = "/"}>Go Home</button>
                </form>

                {message && (
                    <p className={`msg ${message.includes("successfully") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default AddSchool;
