// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../services/api'; // Import the auth service
// import './Login.css';
// import { t } from '../locales';

// const Login = (lang ) => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Call the login API via your new service
//       await authService.login(username, password);
//       // Redirect to the main application (e.g., patients page)
//       navigate('/patients');
//     } catch (err) {
//       // Handle specific error messages from your backend
//       setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <div className="hospital-logo-large">
//             <span className="logo-icon-large">⚕️</span>
//              <h1>{t("login.title")}</h1>
//             <p className="system-title">Management System</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="login-form">
//           {error && <div className="error-message">{error}</div>}
          
//           <div className="form-group">
//             <label>{t("login.username")}</label>
//             <input
//               type="text"
//               id="username"
//              placeholder={t("login.username")}
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="form-input"
//               disabled={loading}
//               required
//             />
//           </div>

//           <div className="form-group">
//            <label>{t("login.password")}</label>
//             <input
//               type="password"
//               id="password"
//               placeholder={t("login.password")}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-input"
//               disabled={loading}
//               required
//             />
//           </div>

//           <button type="submit" className="btn-login" disabled={loading}>
//             {loading ? t("loggingin.submit") : t("login.submit")}
//           </button>

          
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api'; // Import the auth service
import './Login.css';
import { t } from '../locales';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the login API via your new service
      await authService.login(username, password);
      // Redirect to the main application (e.g., patients page)
      navigate('/patients');
    } catch (err) {
      // Handle specific error messages from your backend
      setError(err.response?.data?.message || t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="hospital-logo-large">
            <span className="logo-icon-large">⚕️</span>
            <h1>{t('layout.hospitalLogo')}</h1>
            <p className="system-title">{t('layout.systemTitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">{t('login.username')}</label>
            <input
              type="text"
              id="username"
              placeholder={t('login.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('login.password')}</label>
            <input
              type="password"
              id="password"
              placeholder={t('login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? t('loggingin.submit') : t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;