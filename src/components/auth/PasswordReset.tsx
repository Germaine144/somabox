import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { forgotPasswordSchema, resetPasswordSchema } from '../../utils/validators';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

type ForgotPasswordFormData = {
  email: string;
};

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [emailSent, setEmailSent] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { forgotPassword, resetPassword, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    try {
      await forgotPassword(data);
      setEmailSent(true);
    } catch (error) {
      // Error is handled in auth context
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    clearError();
    try {
      await resetPassword({
        token: token!,
        ...data,
      });
      setPasswordReset(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      // Error is handled in auth context
    }
  };

  if (passwordReset) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Password Reset Successful</h3>
        <p className="text-sm text-gray-500">
          Your password has been reset successfully. Redirecting to login page...
        </p>
        <Button onClick={() => navigate('/login')} variant="outline">
          Go to Login
        </Button>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
        <p className="text-sm text-gray-500">
          We've sent you an email with instructions to reset your password. Please check your inbox.
        </p>
        <Button onClick={() => setEmailSent(false)} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  if (token) {
    return (
      <form className="space-y-6" onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`appearance-none block w-full px-3 py-2 border ${
                resetPasswordForm.formState.errors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              {...resetPasswordForm.register('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
            {resetPasswordForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {resetPasswordForm.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`appearance-none block w-full px-3 py-2 border ${
                resetPasswordForm.formState.errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              {...resetPasswordForm.register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
            {resetPasswordForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {resetPasswordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" loading={loading}>
            Reset Password
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-6" onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <p className="text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`appearance-none block w-full px-3 py-2 border ${
              forgotPasswordForm.formState.errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            {...forgotPasswordForm.register('email')}
          />
          {forgotPasswordForm.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {forgotPasswordForm.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full" loading={loading}>
          Send Reset Link
        </Button>
      </div>

      <div className="text-center text-sm">
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default PasswordReset;