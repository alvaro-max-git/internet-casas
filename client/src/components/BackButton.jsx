import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './BackButton.module.css';

function BackButton({ to = -1 }) {
  const navigate = useNavigate();

  return (
    <button className={styles.backButton} onClick={() => navigate(to)}>
      <FaArrowLeft className={styles.icon} />
    </button>
  );
}

export default BackButton;