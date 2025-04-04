// src/App.jsx
import React from 'react';
import AppRouter from './AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider 
    clientId="386417375955-p9ng4v6k7uif6bsti2t3v1e010e0hl1n.apps.googleusercontent.com"
    scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    >
      <AppRouter />
    </GoogleOAuthProvider>
  );
}

export default App;
