import React from 'react';
import GitHubLoginButton from './components/GitHubLoginButton.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RepoProvider } from './context/RepoContext.jsx';

function App() {
  return (
    // <div>
    //   <h1>Test Case Generator</h1>
    //   <a href="http://localhost:5000/auth/github">
    //     <button>Login with GitHub</button>
    //   </a>
    // </div>
    <RepoProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<GitHubLoginButton />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </RepoProvider>
  );
}
export default App;
