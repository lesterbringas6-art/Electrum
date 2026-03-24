import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function App() {
  const [username, setUname] = useState('');
  const [password, setPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleLogin = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg(''); 
      
      const response = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: false });

      if (response.data.success) {
        setSuccessMsg('Welcome back. Redirecting...');
        setTimeout(() => navigate('/home'), 1200);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Invalid credentials");
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#87ffff] flex items-center justify-center p-6 selection:bg-indigo-100">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
      </div>

      <div className="w-full max-w-[400px] relative">
        <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
          
          <header className="mb-10 text-center">
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Sign in</h1>
            <p className="text-zinc-500 text-sm mt-2">Enter your details to access your account</p>
          </header>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Status Messages */}
            <div className="h-4"> {/* Fixed height prevents layout jump */}
              {errorMsg && <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 text-center">{errorMsg}</p>}
              {successMsg && <p className="text-xs font-medium text-indigo-600 animate-in fade-in text-center">{successMsg}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-700 ml-1">Username</label>
              <input
                type="text" 
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-sm placeholder:text-zinc-400"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUname(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[13px] font-medium text-zinc-700">Password</label>
                <Link to="/forgot" className="text-[11px] text-zinc-400 hover:text-indigo-600 transition-colors">Forgot?</Link>
              </div>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-sm placeholder:text-zinc-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            <button 
              type="button"
              onClick={handleLogin}
              disabled={!!successMsg}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 transform active:scale-[0.98] mt-4
                ${successMsg 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200'} 
                disabled:cursor-not-allowed`}
            >
              {successMsg ? 'Success' : 'Continue'}
            </button>
            
            <footer className="pt-4 text-center">
              <p className="text-sm text-zinc-500">
                New here? {' '}
                <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                  Create an account
                </Link>
              </p>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;