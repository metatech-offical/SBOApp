import { useToast } from 'react-native-toast-notifications';

export type ToastOptions = {
  placement?: 'top' | 'bottom' | 'center';
  duration?: number;
  animationType?: 'slide-in' | 'zoom-in' | 'none';
  type?: 'success' | 'danger' | 'warning' | 'normal' | 'custom';
};

export const useToastMessage = () => {
  const toast = useToast();

  const showToast = (message: string, options: ToastOptions = {}) => {
    toast.show(message, {
      type: options.type || 'normal',
      placement: options.placement || 'bottom',
      duration: options.duration || 3000,
      animationType: options.animationType || 'slide-in',
    });
  };

  const showSuccess = (message: string, options?: ToastOptions) =>
    showToast(message, { ...options, type: 'success' });

  const showError = (message: string, options?: ToastOptions) =>
    showToast(message, { ...options, type: 'danger' });

  const showWarning = (message: string, options?: ToastOptions) =>
    showToast(message, { ...options, type: 'warning' });

  const showInfo = (message: string, options?: ToastOptions) =>
    showToast(message, { ...options, type: 'normal' });

  const clearAllToasts = () => toast.hideAll();

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllToasts,
  };
};