import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  Plane,
  Eye,
  EyeOff
} from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, token } = useAuth();

    // Prevent access to login if already authenticated
    React.useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("/api/auth/login", formData);
            login(res.data.token, res.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Authentication Failed: Sector Access Denied.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-dark-950">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0">
                <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2 }}
                    src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=2000" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-20" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-950/80 to-primary-900/20"></div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]"
                ></motion.div>
                <motion.div 
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 8, repeat: Infinity, delay: -4 }}
                  className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"
                ></motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-xl"
            >
                <div className="premium-card p-12 lg:p-16 backdrop-blur-2xl">
                    <div className="flex flex-col items-center text-center mb-12">
                        <motion.div 
                          animate={{ y: [-10, 10, -10] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="w-20 h-20 bg-primary-600/20 rounded-3xl flex items-center justify-center border border-primary-500/30 mb-8 shadow-xl shadow-primary-500/10"
                        >
                            <Plane className="w-10 h-10 text-primary-400" />
                        </motion.div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-3">Welcome <span className="text-primary-500">Back</span></h2>
                        <p className="text-dark-400 font-medium max-w-xs mx-auto">Authorized personnel only. Initialize orbital credentials to access the hub.</p>
                    </div>

                    {error && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mb-8 p-4 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 overflow-hidden"
                        >
                            <ShieldCheck className="w-4 h-4" /> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-2">Access Frequency (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="agent@skylogist.ai"
                                    className="input-field w-full pl-16 py-5 bg-dark-950/50"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                           <div className="flex justify-between items-center px-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-dark-500">Security Cipher (Password)</label>
                              <button type="button" className="text-[9px] font-black text-primary-500 uppercase tracking-widest hover:underline">Reset Hash</button>
                           </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••••••"
                                    className="input-field w-full pl-16 pr-16 py-5 bg-dark-950/50"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-6 top-1/2 -translate-y-1/2 text-dark-600 hover:text-white transition-colors"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-6 rounded-[24px] shadow-primary-500/20 hover:shadow-primary-500/40 mt-12 group/btn"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-4">
                                    Establish Link
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                </span>
                            )}
                        </motion.button>
                    </form>

                    <p className="relative z-20 mt-12 text-center text-[11px] font-bold text-dark-500 uppercase tracking-widest">
                        New Operator?{" "}
                        <Link to="/register" className="relative z-30 pointer-events-auto text-primary-500 hover:text-primary-400 transition-colors underline underline-offset-8 decoration-primary-500/30">
                            Apply for Clearance
                        </Link>
                    </p>
                </div>
                
                {/* Visual Security Badge */}
                <div className="mt-10 flex items-center justify-center gap-10 opacity-40">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-dark-500" />
                      <span className="text-[9px] font-black text-dark-600 uppercase tracking-[0.2em]">AES-256 Encrypted</span>
                   </div>
                   <div className="w-px h-4 bg-dark-800"></div>
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-[9px] font-black text-dark-600 uppercase tracking-[0.2em]">Global Hub Status: Active</span>
                   </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
