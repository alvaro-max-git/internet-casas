// src/hooks/useAccesses.js
import { useEffect, useState } from 'react';

export function useAccesses() {
  const [accesses, setAccesses] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('accesses');
    if (stored) {
      setAccesses(JSON.parse(stored));
    } else {
      const defaultAccesses = [
        {
          id: 'portal',
          name: 'Calle Falsa Portal',
          from: '2025-03-14T16:00',
          to: '2025-03-16T12:00',
          color: '#FFE5BD'
        },
        {
          id: '3A',
          name: 'Calle Falsa 3ªA',
          from: '2025-03-14T17:00',
          to: '2025-03-16T11:00',
          color: '#DBD2DA'
        }
      ];
      localStorage.setItem('accesses', JSON.stringify(defaultAccesses));
      setAccesses(defaultAccesses);
    }
  }, []);

  const updateAccesses = (newList) => {
    localStorage.setItem('accesses', JSON.stringify(newList));
    setAccesses(newList);
  };

  const addAccess = (newAccess) => {
    const updated = [...accesses, newAccess];
    updateAccesses(updated);
  };

  const editAccess = (accessId, updatedData) => {
    const updated = accesses.map((a) =>
      a.id === accessId ? { ...a, ...updatedData } : a
    );
    updateAccesses(updated);
  };

  return {
    accesses,
    setAccesses: updateAccesses,
    addAccess,
    editAccess
  };
}