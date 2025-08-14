import React, { useState, useEffect } from 'react';
import GitHubLoginButton from './components/GitHubLoginButton.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { RepoProvider } from './context/RepoContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark', 'text-white');
    } else {
      document.body.classList.remove('bg-dark', 'text-white');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <RepoProvider>
      <BrowserRouter>
        {/* Header with Dark Mode Toggle */}
        <header className={`d-flex justify-content-between align-items-center p-3 ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
          <h4 className="m-0">
            <Link to="/" className={darkMode ? 'text-white text-decoration-none' : 'text-dark text-decoration-none'}>
              Test Case Generator
            </Link>
          </h4>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-outline-primary"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        {/* App Routes */}
        <Routes>
          <Route path='/' element={<GitHubLoginButton />} />
          <Route path='/dashboard' element={<Dashboard darkMode={darkMode} />} />
        </Routes>
      </BrowserRouter>
    </RepoProvider>
  );
}

export default App;
