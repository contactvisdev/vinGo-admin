import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm, FormProvider } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import TextInput from 'components/form/TextInput';
import { emailSchema, passwordSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/logo-dark.svg';
import { useForgotPasswordMutation } from '../../store/api/adminApi';
import { useDispatch } from 'react-redux';
import { authenticate } from '../../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/favicon.svg';

// ==============================|| AUTH LOGIN FORM ||============================== //

export default function AuthForgotPasswordForm({ className }) {
  const [forgotPassword, { isLoading: loading }] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({ mode: 'onChange' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = methods;

  const onSubmit = async (data) => {
    try {
      await forgotPassword({
        email: data.email
      }).unwrap();
      reset();
      navigate('/otp-verification', {
        state: {
          email: data.email
        }
      });
    } catch (err) {
      console.error('Failed to send OTP:', err);
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="d-flex justify-content-center align-items-center py-3">
        <a className="b-brand d-flex align-items-center  text-decoration-none">
          <Image src="/logo.png" fluid className="logo logo-lg" alt="logo" style={{ maxHeight: '50px' }} />
          <span className="fw-semibold fs-5 text-4xl" style={{ color: '#00C2FF' }}>
            vinGo
          </span>
        </a>
      </div>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Forgot Password</h4>
          <p className="text-center mb-4 text-muted">
            Enter your registered email address, and we&apos;ll send you an OTP to verify your identity and reset your password.
          </p>

          <TextInput
            name="email"
            type="email"
            placeholder="Email Address"
            rules={emailSchema}
            className="mb-3"
            inputClassName={className ? 'bg-transparent border-white text-white border-opacity-25' : ''}
          />

          <div className="text-center mt-4">
            <Button type="submit" className="shadow px-sm-4" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </div>

          <div className="text-center mt-3">
            <span className="text-muted">Remember your password? </span>
            <Link to="/" className="fw-medium text-decoration-none">
              Sign in
            </Link>
          </div>
        </Form>
      </FormProvider>
    </MainCard>
  );
}

AuthForgotPasswordForm.propTypes = { className: PropTypes.string, link: PropTypes.string, resetLink: PropTypes.string };
