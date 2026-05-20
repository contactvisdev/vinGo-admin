import AuthOtpVerificationForm from '../../../components/auth/AuthOtpVerificationForm';

// ===========================|| AUTH - OTP Verification V1 ||=========================== //

export default function OtpVerificationPage() {
  return (
    <div className="auth-main">
      <div className="auth-wrapper v1">
        <div className="auth-form">
          <div className="position-relative">
            <div className="auth-bg">
              <span className="r"></span>
              <span className="r s"></span>
              <span className="r s"></span>
              <span className="r"></span>
            </div>
            <AuthOtpVerificationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
