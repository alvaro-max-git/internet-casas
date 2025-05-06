import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './BackButton.module.css';

function BackButton({ to, className = '', id }) {
  const navigate = useNavigate();

  return (
    <button 
    id={id}
    className={styles.backButton} 
    onClick={() => navigate(to)}>
      <FaArrowLeft className={styles.icon} />
    </button>
  );
}

export default BackButton;