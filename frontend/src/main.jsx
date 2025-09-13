import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { AuthProvider } from './context/AuthContext.jsx'; // <-- IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AuthProvider> {/* <-- WRAP APP */}
    <App />
    </AuthProvider>
  </React.StrictMode>,
)
