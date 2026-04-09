import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { db } from '../services/offline-db';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import loginImage from '../assets/HS1.jpg'; 
import logoImage from '../assets/AlsLogo.png'; 
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Login successful!');
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (authError) throw authError;

        if (authData?.user) {
          await supabase.from('student_progress').insert([{
            user_id: authData.user.id,
            module_type: 'HUMSS',
            module_name: 'Communication Skills Module 1 - Test',
            score: 85
          }]);
        }
        setMessage('Registration successful! You can now log in.');
        setIsLogin(true); 
      }
    } catch (error) {
      setMessage(error.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top App Bar */}
      <header className="app-header">
        <div className="header-brand">
          <img src={logoImage} alt="ALS Logo" className="header-logo" />
          <div className="header-text">
            <h1>ALS Philippines</h1>
            <p>Offline Learning Portal</p>
          </div>
        </div>
      </header>


      {/* --- NEW SPLIT LAYOUT WRAPPER --- */}
      <div className="split-layout">
        
        {/* LEFT SIDE: Login Box */}
        <div className="layout-left">
          <div className="auth-card">
            <div className="card-header">
              <h2>{isLogin ? 'Welcome!' : 'Create Account'}</h2>
              <p>{isLogin ? 'Log in to access your ALS modules' : 'Sign up to start learning offline'}</p>
            </div>

            {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

            <form onSubmit={handleAuth} className="auth-form">
              {!isLogin && (
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={20} />
                    <input 
                      type="text" 
                      placeholder="Juan Dela Cruz" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin} 
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>{isLogin ? 'Username or Email' : 'Email'}</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input 
                    type="email" 
                    placeholder="Enter your Username/Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="form-actions">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember Me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="toggle-auth">
              <p>
                {isLogin ? "New to ALS? Create an account." : "Already have an account?"}
              </p>
              <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
                {isLogin ? 'Sign Up ' : 'Log In '}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Image Placeholder */}
        <div className="layout-right">
          <img 
            src={loginImage} 
            alt="ALS Student Learning" 
            className="hero-image" 
          />
        </div>

      </div>
      {/* --- END SPLIT LAYOUT --- */}

      {/* Footer Branding */}
      <footer className="app-footer">
        <div className="logos-placeholder">
          <span className="deped-logo">DepED</span>
        </div>
        <p className="version-text">v1.3.1 | Offline mode available after first sync.</p>
      </footer>
    </div>
  );
}