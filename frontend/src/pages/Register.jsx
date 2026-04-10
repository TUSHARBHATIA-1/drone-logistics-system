import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Building,
    ArrowRight,
    ShieldCheck,
    Loader2,
    Plane,
    PlusCircle,
    Eye,
    EyeOff,
    Phone,
    MapPin
} from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        warehouseAddress: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login, token } = useAuth();

    // Prevent access to register if already authenticated
    React.useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        console.log("FORM SUBMITTED", formData);
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
            console.log("REGISTRATION RESPONSE STATUS:", res.status);
            console.log("REGISTRATION RESPONSE DATA:", res.data);

            if (res.status === 200 || res.status === 201) {
                const token = res.data?.token;
                const user = res.data?.user;

                if (token) {
                    login(token, user);
                } else {
                    // Token missing but registration succeeded — still navigate
                    console.warn("Registration succeeded but no token returned:", res.data);
                }
                navigate("/setup-company");
            } else {
                // Non-success status came through without throwing (unusual for axios)
                setError(`Registration failed (status ${res.status}). Please try again.`);
            }
        } catch (err) {
            console.error("REGISTRATION ERROR", err);
            const serverMessage = err.response?.data?.message || err.response?.data?.error;
            setError(serverMessage || "Registration Failed. Check connection to Mission Control.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dark-950 relative overflow-hidden">
            {/* Background Layer - Set to pointer-events-none to prevent blocking */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15),transparent_70%)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-50 pointer-events-auto"
            >
                <div className="premium-card p-10 backdrop-blur-xl relative z-50">
                    <h2 className="text-2xl md:text-3xl text-center font-black text-white mb-8 md:mb-10 uppercase tracking-tight">
                        Register <span className="text-primary-500">Account</span>
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-600/10 border border-red-500 text-red-500 text-sm rounded flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-50">
                        {/* Username */}
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="input-field col-span-2"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        {/* Company */}
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            className="input-field col-span-2"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />

                        {/* Contact */}
                        <input
                            type="text"
                            name="contactPerson"
                            placeholder="Contact Person"
                            className="input-field"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            required
                        />

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        {/* Phone */}
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            className="input-field"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        {/* Address */}
                        <input
                            type="text"
                            name="warehouseAddress"
                            placeholder="Warehouse Address"
                            className="input-field"
                            value={formData.warehouseAddress}
                            onChange={handleChange}
                            required
                        />

                        {/* Password */}
                        <div className="col-span-2 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="input-field w-full pr-10"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary col-span-2 py-5 md:py-6 relative z-50 cursor-pointer rounded-2xl md:rounded-[24px]"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto w-6 h-6" /> : "Register"}
                        </button>

                        {/* Fallback Test Button */}
                        <button 
                            type="button" 
                            onClick={handleSubmit}
                            className="col-span-2 text-[10px] text-gray-600 hover:text-primary-500 uppercase tracking-widest mt-2"
                        >
                            Emergency Force Submit (Bypass Form Validation)
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary-500 underline hover:text-primary-400">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;