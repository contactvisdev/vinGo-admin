import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm, FormProvider } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { otpSchema } from '../../utils/validationSchema';

// assets
import DarkLogo from 'assets/images/logo-dark.svg';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../store/api/adminApi';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/favicon.svg';

export default function AuthOtpVerificationForm({ className }) {
  const [verifyOtp, { isLoading: loading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || {};

  const methods = useForm({ mode: 'onChange' });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = methods;

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const onSubmit = async (data) => {
    try {
      await verifyOtp({
        email: email,
        otp: data.otp
      }).unwrap();
      navigate('/');
      reset();
    } catch (err) {
      console.error('Failed to verify OTP:', err);
    }
  };

  const handleResendOtp = async () => {
    try {
      setCanResend(false);
      setTimer(60);
      await resendOtp({ email }).unwrap();
      reset();
    } catch (err) {
      console.error('Failed to resend OTP:', err);
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
          <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>OTP Verification</h4>
          <p className="text-center mb-4 text-muted">Please enter the 6-digit OTP sent to your registered email address.</p>

          <Form.Group className="mb-3" controlId="formOtp">
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              maxLength={6}
              {...register('otp', otpSchema)}
              isInvalid={!!errors.otp}
              className={className && 'bg-transparent border-white text-white border-opacity-25 text-center fw-bold'}
            />
            <Form.Control.Feedback type="invalid">{errors.otp?.message}</Form.Control.Feedback>
          </Form.Group>

          <div className="text-center mt-2">
            {!canResend ? (
              <span className="text-muted">
                Resend OTP in <strong>{timer}</strong> sec
              </span>
            ) : (
              <Button variant="link" className="p-0 text-decoration-none fw-medium" onClick={handleResendOtp}>
                Resend OTP
              </Button>
            )}
          </div>

          <div className="text-center mt-4">
            <Button type="submit" className="shadow px-sm-4" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </div>

          <Stack direction="horizontal" className="justify-content-center mt-3">
            <Link to="/" className={`text-secondary f-w-400 ${className}`}>
              Back to Login
            </Link>
          </Stack>
        </Form>
      </FormProvider>
    </MainCard>
  );
}

AuthOtpVerificationForm.propTypes = {
  className: PropTypes.string
};
