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
import Logo from '../../assets/images/favicon.svg';
import { useLoginMutation } from '../../store/api/adminApi';
import { useDispatch } from 'react-redux';
import { authenticate } from '../../services/auth';
import { Link, useNavigate } from 'react-router-dom';

// ==============================|| AUTH LOGIN FORM ||============================== //

export default function AuthLoginForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [login, { isLoading: loading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm({ mode: 'onChange' });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = methods;

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    setAuthError('');
    clearErrors(['email', 'password']);

    try {
      const res = await login({
        email: data.email,
        password: data.password
      }).unwrap();

      if (res?.status === 'success') {
        reset();
        const rememberMe = data.rememberMe || false;

        // Store token
        authenticate(res?.data?.token, rememberMe, () => {
          // Store user data
          const userData = JSON.stringify(res?.data?.user);
          if (rememberMe) {
            localStorage.setItem('userData', userData);
          } else {
            sessionStorage.setItem('userData', userData);
          }
          navigate('/dashboard');
        });
      }
    } catch (err) {
      const message = err?.data?.message || err?.data?.error || 'Invalid email or password. Please try again.';

      setAuthError(message);
      console.error('Login failed:', err);
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="d-flex justify-content-center align-items-center py-3">
        <a className="b-brand d-flex align-items-center  text-decoration-none">
          <Image src={Logo} fluid className="logo logo-lg" alt="logo" />
          <span className="fw-semibold fs-5 text-4xl" style={{ color: '#00C2FF' }}>
            X-7
          </span>
        </a>
      </div>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Login</h4>
          <TextInput
            name="email"
            type="email"
            placeholder="Email Address"
            rules={emailSchema}
            className="mb-3"
            autoComplete="email"
            inputClassName={className && 'bg-transparent border-white text-white border-opacity-25'}
          />
          <Form.Group className="mb-3" controlId="formPassword">
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                {...register('password', passwordSchema)}
                isInvalid={!!errors.password}
                className={className && 'bg-transparent border-white text-white border-opacity-25 '}
              />
              <Button onClick={togglePasswordVisibility}>
                {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
              </Button>
            </InputGroup>
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>
          {authError ? <div className="text-danger mb-2 small">{authError}</div> : null}

          <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
            <Form.Group controlId="customCheckc1">
              <Form.Check
                type="checkbox"
                label="Remember me?"
                {...register('rememberMe')}
                className={`input-primary ${className ? className : 'text-muted'} `}
              />
            </Form.Group>
            <Link to={'/forgot-password'} className={`text-secondary f-w-400 mb-0  ${className}`}>
              Forgot Password?
            </Link>
          </Stack>
          <div className="text-center mt-4">
            <Button type="submit" className="shadow px-sm-4" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
          {/* <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Don't have an Account?</h6>
          <a href={link} className="link-primary">
            Create Account
          </a>
        </Stack> */}
        </Form>
      </FormProvider>
    </MainCard>
  );
}

AuthLoginForm.propTypes = { className: PropTypes.string, link: PropTypes.string, resetLink: PropTypes.string };
