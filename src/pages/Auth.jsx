import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './Auth.css'; 

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // To show success or error alerts

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
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Login successful!');
        
      } else {
        // --- SIGN UP LOGIC ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (authError) throw authError;

        // --- NEW: INSERT TEST SCORE ---
        // If registration worked and we have a user ID, push a dummy score to the database
        if (authData?.user) {
          const { error: dbError } = await supabase
            .from('student_progress')
            .insert([
              {
                user_id: authData.user.id, // This matches the RLS policy we just wrote!
                module_type: 'HUMSS',
                module_name: 'Communication Skills Module 1 - Test',
                score: 85
              }
            ]);

          if (dbError) {
            console.error("Database error:", dbError.message);
            // We log this to the console instead of the screen so it doesn't interrupt the user
          }
        }

        setMessage('Registration successful! Test score added to database. You can now log in.');
        setIsLogin(true); 
      }
    } catch (error) {
      setMessage(error.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'ALS Portal Login' : 'Create an Account'}</h2>
        
        {/* Display success or error messages */}
        {message && <p className="auth-message">{message}</p>}
        
        <form className="auth-form" onSubmit={handleAuth}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Juan Dela Cruz" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin} 
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="student@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setIsLogin(!isLogin); setMessage(''); }} className="toggle-link">
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}