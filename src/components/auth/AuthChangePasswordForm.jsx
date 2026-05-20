import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

// third-party
import { useForm, FormProvider } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { passwordSchema, confirmPasswordSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/logo-dark.svg';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useChangePasswordMutation } from '../../store/api/profileApi';

// ==============================|| AUTH CHANGE PASSWORD FORM ||============================== //

export default function AuthChangePasswordForm({ className }) {
  const [changePassword, { isLoading: loading }] = useChangePasswordMutation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const user = useSelector((state) => state?.auth?.user);
  const navigate = useNavigate();

  const methods = useForm({ mode: 'onChange' });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = methods;

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    const payload = {
      email: user?.email,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    };
    try {
      await changePassword(payload).unwrap();
      reset();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="username" autoComplete="username" value={user?.email || ''} readOnly hidden aria-hidden="true" />
        {/* Old Password */}
        <Form.Group className="mb-3 " controlId="formOldPassword">
          <div className="position-relative">
            <Form.Control
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Old Password"
              autoComplete="current-password"
              {...register('oldPassword', passwordSchema)}
              isInvalid={!!errors.oldPassword}
              className={className && 'bg-transparent border-white text-white border-opacity-25'}
            />
            <Button
              type="button"
              variant="link"
              className="position-absolute end-0 top-0 mt-1 me-2 text-muted"
              onClick={() => setShowOldPassword((prev) => !prev)}
            >
              {showOldPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
            <Form.Control.Feedback type="invalid">{errors.oldPassword?.message}</Form.Control.Feedback>
          </div>
        </Form.Group>

        {/* New Password */}
        <Form.Group className="mb-3" controlId="formNewPassword">
          <div className="position-relative">
            <Form.Control
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              autoComplete="new-password"
              {...register('newPassword', passwordSchema)}
              isInvalid={!!errors.newPassword}
              className={className && 'bg-transparent border-white text-white border-opacity-25'}
            />
            <Button
              type="button"
              variant="link"
              className="position-absolute end-0 top-0 mt-1 me-2 text-muted"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
            <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
          </div>
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <div className="position-relative">
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              autoComplete="new-password"
              {...register(
                'confirmPassword',
                confirmPasswordSchema(() => newPassword)
              )}
              isInvalid={!!errors.confirmPassword}
              className={className && 'bg-transparent border-white text-white border-opacity-25'}
            />
            <Button
              type="button"
              variant="link"
              className="position-absolute end-0 top-0 mt-1 me-2 text-muted"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
          </div>
        </Form.Group>

        <div className=" mt-4">
          <Button type="submit" className="shadow px-sm-4" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
}

AuthChangePasswordForm.propTypes = { className: PropTypes.string };
