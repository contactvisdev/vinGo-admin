import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Image, Card } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';

// project imports
import MainCard from 'components/MainCard';
import TextInput from 'components/form/TextInput';
import ChangePasswordPage from '../auth/change-password/ChangePassword';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/api/profileApi';
import { singleFileUpload } from '../../utils/singleFileUpload';
import { PLACEHOLDER_AVATAR } from '../../utils/placeholders';

export default function SettingsPage() {
  const dispatch = useDispatch();

  const { data: profile, isLoading: isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [localFile, setLocalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (localFile) {
      const url = URL.createObjectURL(localFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [localFile]);

  const loading = isUpdating || loadingImage;

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      profilePic: ''
    }
  });
  const { register, handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (profile) {
      const { name, email, phone, profilePic } = profile.data;
      reset({ name, email, phone, profilePic });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    try {
      await updateProfile({ id: profile?.data?._id, payload: data }).unwrap();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div style={{ background: '#f8f9fb', minHeight: '100vh', padding: '24px' }}>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Account Settings</h3>
        <p className="text-muted mb-0">Manage your profile and security settings</p>
      </div>
      <Row className="g-4">
        {/* PROFILE SETTINGS */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-semibold mb-0">Profile Information</h5>
              </div>

              {/* Profile Header with Image */}
              <div className="text-center mb-4 p-4" style={{ background: '#f8f9fb', borderRadius: '12px' }}>
                <div className="position-relative d-inline-block">
                  <Image
                    src={previewUrl || profile?.data?.profilePic || PLACEHOLDER_AVATAR}
                    roundedCircle
                    width={120}
                    height={120}
                    style={{
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      objectFit: 'cover'
                    }}
                    alt="Profile"
                  />
                  <div
                    className="position-absolute"
                    style={{
                      bottom: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0d6efd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>

                <h5 className="mt-3 mb-1 fw-bold">{profile?.name || 'Not Available'}</h5>
                <div className="text-muted small">{profile?.email}</div>

                <div className="mt-3">
                  <label className="btn btn-outline-primary btn-sm" style={{ cursor: 'pointer' }}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="me-1"
                      style={{ marginBottom: '2px' }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload New Photo
                    <Form.Control
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={singleFileUpload({
                        fieldName: 'profilePic',
                        setValue,
                        dispatch,
                        setLocalFile,
                        setLoading: setLoadingImage,
                        imageOnly: true,
                        setErrorMessage: setImageError
                      })}
                    />
                  </label>
                </div>

                {imageError && <div className="alert alert-danger mt-2 mb-0 py-2 small">{imageError}</div>}
              </div>

              {/* Profile Form */}
              <FormProvider {...methods}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <TextInput name="name" label="FULL NAME" placeholder="Enter your full name" />
                  <TextInput name="phone" label="PHONE NUMBER" readOnly disabled />
                  <TextInput name="email" label="EMAIL ADDRESS" type="email" readOnly disabled />

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="me-2"
                            style={{ marginBottom: '2px' }}
                          >
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </FormProvider>
            </Card.Body>
          </Card>
        </Col>

        {/* CHANGE PASSWORD */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-semibold mb-0">Security Settings</h5>
                <div className="badge bg-light text-dark">Security</div>
              </div>

              <div
                className="mb-4 p-3 d-flex align-items-start gap-3"
                style={{
                  background: '#fff3cd',
                  borderRadius: '8px',
                  border: '1px solid #ffecb5'
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#856404"
                  strokeWidth="2"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div style={{ color: '#856404' }}>
                  <div className="fw-semibold small mb-1">Password Security</div>
                  <div className="small">Use a strong password with at least 8 characters, including numbers and special characters.</div>
                </div>
              </div>

              <ChangePasswordPage />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
