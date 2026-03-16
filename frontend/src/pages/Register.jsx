import { registerUser } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      const data = await registerUser({
        name: formData.companyName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,#1e293b,transparent),radial-gradient(circle_at_bottom_left,#0f172a,transparent)]">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <h2 className="text-4xl text-white font-bold font-outfit">Join the Fleet</h2>
          <p className="text-dark-400 mt-2 font-medium">Create your autonomous logistics hub today.</p>
        </div>

        <div className="glass-card p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {error && (
              <div className="md:col-span-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark-500 ml-1">Company Name</label>
              <div className="relative group">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 group-focus-within:text-primary-500 transition-colors" />
                <input name="companyName" onChange={handleChange} value={formData.companyName} type="text" placeholder="Global Logistics Inc." className="input-field w-full pl-12" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark-500 ml-1">Contact Person</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 group-focus-within:text-primary-500 transition-colors" />
                <input name="contactPerson" onChange={handleChange} value={formData.contactPerson} type="text" placeholder="John Doe" className="input-field w-full pl-12" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark-500 ml-1">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 group-focus-within:text-primary-500 transition-colors" />
                <input name="email" onChange={handleChange} value={formData.email} type="email" placeholder="contact@company.io" className="input-field w-full pl-12" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark-500 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 group-focus-within:text-primary-500 transition-colors" />
                <input name="phone" onChange={handleChange} value={formData.phone} type="tel" placeholder="+1 (555) 000-0000" className="input-field w-full pl-12" required />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark-500 ml-1">Warehouse HQ Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 group-focus-within:text-primary-500 transition-colors" />
                <input name="address" onChange={handleChange} value={formData.address} type="text" placeholder="123 Skyway Avenue, Tech Park, CA" className="input-field w-full pl-12" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 group-focus-within:text-primary-500 transition-colors" />
                <input name="password" onChange={handleChange} value={formData.password} type="password" placeholder="••••••••" className="input-field w-full pl-12" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark-500 ml-1">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 group-focus-within:text-primary-500 transition-colors" />
                <input name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} type="password" placeholder="••••••••" className="input-field w-full pl-12" required />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary md:col-span-2 py-4 mt-4 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Initialize Company Account'} 
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-8">
            Already registered? <Link to="/login" className="text-primary-500 hover:text-primary-400 font-bold">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
