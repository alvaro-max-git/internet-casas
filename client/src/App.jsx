// src/App.jsx
import React from 'react';
import AppRouter from './AppRouter';

function App() {
  return (
    <div>
      {/* El Router se define dentro de main.jsx, 
          aquí solo usas tu enrutador personalizado */}
      <AppRouter />
    </div>
  );
}

export default App;

