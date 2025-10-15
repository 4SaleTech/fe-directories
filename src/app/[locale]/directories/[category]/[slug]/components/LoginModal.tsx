'use client';

import { useState } from 'react';
import styles from './LoginModal.module.scss';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  locale: string;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess, locale }: LoginModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v2/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token in localStorage
      // The response structure is: { data: { token: { access_token: "..." }, user: {...} } }
      if (data.data && data.data.token && data.data.token.access_token) {
        localStorage.setItem('auth_token', data.data.token.access_token);
        onLoginSuccess();
        handleClose();
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        locale === 'ar'
          ? 'فشل تسجيل الدخول. تحقق من رقم الهاتف وكلمة المرور'
          : 'Login failed. Please check your phone number and password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>
              {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className={styles.input}
              placeholder={locale === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx'}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              {locale === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder={locale === 'ar' ? '••••••••' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading
              ? (locale === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Logging in...')
              : (locale === 'ar' ? 'تسجيل الدخول' : 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
