import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordReset from '../../components/auth/PasswordReset';

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll help you get back into your account"
    >
      <PasswordReset />
    </AuthLayout>
  );
};

export default ForgotPassword;