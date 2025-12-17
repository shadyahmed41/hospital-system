import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";
import { authService } from "../services/api";
import { t, setLanguage, getLanguage } from "../locales";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/patients", label:  t("layout.patients"), icon: "👤" },
    { path: "/visits", label: t("layout.visits"), icon: "📋" },
    { path: "/accounts", label: t("layout.accounts"), icon: "👨‍⚕️" },
  ];

  const currentLang = getLanguage();

  const handleLanguageToggle = () => {
    const newLang = currentLang === "ar" ? "en" : "ar";
    setLanguage(newLang);
    window.location.reload();
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    // Try to get from localStorage first (set during login)
    const storedName = localStorage.getItem("user_name");
    const storedRole = localStorage.getItem("user_role");

    // Fallback to token decoding if localStorage doesn't have it
    if (!storedName || !storedRole) {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Decode JWT token to get user info
          const payload = JSON.parse(atob(token.split(".")[1]));
          return {
            name: payload.name || t("layout.admin"),
            role: payload.role || t("layout.medicalStaff"),
          };
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
    }

    return {
      name: storedName || t("layout.admin"),
      role: storedRole || t("layout.medicalStaff"),
    };
  };

  const userInfo = getUserInfo();

  const handleLogout = () => {
     if (window.confirm(t("layout.confirmLogout"))) {
      authService.logout();
      navigate("/login");
    }
  };

   return (
    <div className='layout'>
      <nav className='sidebar'>
        <div className='sidebar-header'>
          <div className='hospital-logo'>
            <span className='logo-icon'>⚕️</span>
            <h1>{t("layout.hospitalName")}</h1>
            <span className='logo-subtitle'>{t("layout.systemTitle")}</span>
          </div>
        </div>

        <div className='nav-items'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname.startsWith(item.path) ? "active" : ""
              }`}
            >
              <span className='nav-icon'>{item.icon}</span>
              <span className='nav-label'>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className='sidebar-footer'>
          <div className='user-profile'>
            <div className='user-avatar'>
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className='user-info'>
              <span className='user-name'>{userInfo.name}</span>
              <span className='user-role'>{userInfo.role}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className='main-content'>
        <div className='content-header'>
          <div className='breadcrumb'>
            {/* {location.pathname === "/patients" && t("layout.patients")} */}
            {/* {location.pathname === "/visits" && t("layout.visits")} */}
            {/* {location.pathname === "/accounts" && t("layout.accounts")} */}
            {location.pathname.startsWith("/patients/") && t("layout.patientProfile")}
          </div>

          <div className='header-actions'>
            <button className='logout-header-btn' onClick={handleLogout}>
              <span className='logout-header-icon'>🚪</span>
              <span>{t("layout.logout")}</span>
            </button>
            <button
              className='language-icon-btn'
              onClick={handleLanguageToggle}
              title={
                currentLang === "ar"
                  ? t("layout.switchToEnglish")
                  : t("layout.switchToArabic")
              }
            >
              {currentLang === "ar" ? "ع" : "En"}
            </button>
          </div>
        </div>

        <div className='content-area'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;