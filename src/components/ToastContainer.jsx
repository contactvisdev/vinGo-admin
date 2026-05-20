import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';

export default function ToastContainer() {
  const { toastInfo } = useSelector((state) => state?.common);

  useEffect(() => {
    if (toastInfo?.title) {
      const message = toastInfo.detail ? `${toastInfo.title}: ${toastInfo.detail}` : toastInfo.title;

      switch (toastInfo.type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
        case 'danger':
          toast.error(message);
          break;
        case 'warn':
        case 'warning':
          toast(message);
          break;
        case 'info':
        default:
          toast(message);
      }
    }
  }, [toastInfo]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        success: {
          style: { background: '#d1fae5', color: '#065f46' },
          iconTheme: { primary: '#10b981', secondary: '#fff' }
        },
        error: {
          style: { background: '#fee2e2', color: '#991b1b' },
          iconTheme: { primary: '#ef4444', secondary: '#fff' }
        }
      }}
    />
  );
}
