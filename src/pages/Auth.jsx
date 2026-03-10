import { useState } from 'react';
import './Auth.css'; // Linking your standard CSS

export default function Auth() {
  // This state variable tracks which form to show. It defaults to 'true' (Login).
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'ALS Portal Login' : 'Create an Account'}</h2>
        
        <form className="auth-form">
          {/* Only show the Name field if they are registering */}
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Juan Dela Cruz" required />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="student@example.com" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="primary-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            {/* When this span is clicked, it flips the isLogin state! */}
            <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}