import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AccountSelectionPage from './pages/AccountSelectionPage';
import ConversationsPage from './pages/ConversationsPage';

import './App.css';

function App() {
  return (
    <div className="App">
      <h2>Welcome to the messenger app!</h2>
      <Link to="/">Account Selection</Link>
      <br />
      <Link to="/conversations">Conversations</Link>

      <Routes>
        <Route path="/" element={<AccountSelectionPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
      </Routes>
    </div>
  );
}

export default App;
