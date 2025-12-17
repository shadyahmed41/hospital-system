// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import Login from './pages/Login'
// import Patients from './pages/Patients'
// import PatientProfile from './pages/PatientProfile'
// import Accounts from './pages/Accounts'
// import Visits from './pages/Visits'
// import Layout from './components/Layout'
// import './App.css'
// import { getLanguage, setLanguage, getDirection } from "./locales";

// // Protected Route wrapper component
// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('access_token')
  
//   if (!token) {
//     // Redirect to login if no token
//     return <Navigate to="/login" replace />
//   }
  
//   return children
// }

// // Component to handle initial redirect
// const AppContent = () => {
//   const location = useLocation()
  
//   useEffect(() => {
//     // On initial load, check if we're on login page or have token
//     const token = localStorage.getItem('access_token')
//     const isLoginPage = location.pathname === '/login'
    
//     if (!token && !isLoginPage) {
//       // This will be caught by ProtectedRoute, but ensures initial load redirects
//       window.location.href = '/login'
//     }
//   }, [location])

//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/" element={
//         <ProtectedRoute>
//           <Layout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<Navigate to="/patients" replace />} />
//         <Route path="patients" element={<Patients />} />
//         <Route path="patients/:id" element={<PatientProfile />} />
//         <Route path="accounts" element={<Accounts />} />
//         <Route path="visits" element={<Visits />} />
//       </Route>
      
//       {/* Catch all route - redirect to login if no token, otherwise to patients */}
//       <Route path="*" element={
//         localStorage.getItem('access_token') ? 
//           <Navigate to="/patients" replace /> : 
//           <Navigate to="/login" replace />
//       } />
//     </Routes>
//   )
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Login from './pages/Login'
import Patients from './pages/Patients'
import PatientProfile from './pages/PatientProfile'
import Accounts from './pages/Accounts'
import Visits from './pages/Visits'
import Layout from './components/Layout'
import './App.css'
import { getLanguage, getDirection } from "./locales";

// Set language and direction on initial load
const initializeLanguage = () => {
  const lang = getLanguage();
  const dir = getDirection();
  
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  

};

// Run initialization
initializeLanguage();

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Component to handle initial redirect
const AppContent = () => {
  const location = useLocation()
  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const isLoginPage = location.pathname === '/login'
    
    if (!token && !isLoginPage) {
      window.location.href = '/login'
    }
  }, [location])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/patients" replace />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientProfile />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="visits" element={<Visits />} />
      </Route>
      
      <Route path="*" element={
        localStorage.getItem('access_token') ? 
          <Navigate to="/patients" replace /> : 
          <Navigate to="/login" replace />
      } />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App