import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TOAST_DURATION } from '../../constants';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: TOAST_DURATION,
          style: {
            background: 'var(--toast-bg, #18181b)',
            color: 'var(--toast-color, #fafafa)',
            borderRadius: '14px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
          },
        }}
      />
    </>
  );
};
