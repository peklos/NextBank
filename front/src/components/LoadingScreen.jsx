// front/src/components/LoadingScreen.jsx
import React from 'react';
import styles from '../styles/loadingScreen.module.css';

const LoadingScreen = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.background}>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
                <div className={styles.gradientBlob}></div>
            </div>

            <div className={styles.loadingContent}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoIcon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L3 7V21H21V7L12 2Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16V12M8 12H16" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 16H16" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <h1 className={styles.logoText}>NEXT</h1>
                </div>

                <div className={styles.loaderContainer}>
                    <div className={styles.loader}>
                        <div className={styles.loaderDot}></div>
                        <div className={styles.loaderDot}></div>
                        <div className={styles.loaderDot}></div>
                    </div>
                    <p className={styles.loadingText}>Загрузка...</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;