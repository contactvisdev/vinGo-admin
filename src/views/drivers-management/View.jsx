import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import AutoSkeleton from 'components/AutoSkeleton';
import TopTitleCard from '../../components/cards/CustomCard';
import { useGetDriverByIdQuery, useUpdateDriverMutation } from '../../store/api/driverApi';

/* ================== UTILITY COMPONENTS ================== */

const InfoRow = React.memo(({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted">{label}</span>
    <span className="fw-semibold">{value || 'Not Available'}</span>
  </div>
));

const FilePreview = React.memo(({ fileUrl }) => {
  if (!fileUrl) return <span className="text-muted">Not Uploaded</span>;

  const isPDF = fileUrl.toLowerCase().endsWith('.pdf');

  return isPDF ? (
    <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
      View PDF
    </a>
  ) : (
    <a href={fileUrl} target="_blank" rel="noreferrer">
      <img
        src={fileUrl}
        alt="document"
        style={{
          width: 120,
          height: 120,
          objectFit: 'cover',
          borderRadius: 8,
          border: '1px solid #dee2e6'
        }}
      />
    </a>
  );
});

/* ================== MAIN CONTENT ================== */

const DriverContent = ({ driver }) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    status,
    isVerified,
    isDocumentVerified,
    isEmailVerified,
    isPhoneVerified,
    isOnline,
    isOnOrder,
    rating,
    dob,
    gender,
    profilePic,
    address_line1,
    address_line2,
    city,
    state,
    country,
    zipCode,
    documents,
    createdAt
  } = driver;

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'Not Available';
  const initials = displayName[0] || '?';

  return (
    <div>
      {/* Header Card */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md="auto">
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 600
                }}
              >
                {documents?.profilePic || profilePic ? (
                  <img
                    src={documents?.profilePic || profilePic}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initials
                )}
              </div>
            </Col>

            <Col>
              <h4 className="mb-1">{displayName}</h4>
              <div className="text-muted mb-2">{email || 'Not Available'}</div>
              <Badge bg={status !== 'pending' ? 'success' : 'secondary'} className="me-2">
                {(status || 'inactive').toUpperCase()}
              </Badge>
              <Badge bg={isVerified ? 'success' : 'danger'}>{isVerified ? 'VERIFIED' : 'NOT VERIFIED'}</Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Personal Information */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body>
          <h6 className="text-uppercase text-muted mb-3">Personal Information</h6>
          <Row>
            <Col md={6}>
              <InfoRow label="Phone" value={phone} />
              <InfoRow label="Date of Birth" value={dob ? new Date(dob).toLocaleDateString() : null} />
              <InfoRow label="Gender" value={gender} />
            </Col>
            <Col md={6}>
              <InfoRow label="Rating" value={rating ?? '-'} />
              <InfoRow label="Joined" value={createdAt ? new Date(createdAt).toLocaleDateString() : null} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Status & Verification */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body>
          <h6 className="text-uppercase text-muted mb-3">Status & Verification</h6>
          <Row>
            <Col md={6}>
              <InfoRow
                label="Document Verified"
                value={<Badge bg={isDocumentVerified ? 'success' : 'danger'}>{isDocumentVerified ? 'Yes' : 'No'}</Badge>}
              />
              <InfoRow
                label="Email Verified"
                value={<Badge bg={isEmailVerified ? 'success' : 'danger'}>{isEmailVerified ? 'Yes' : 'No'}</Badge>}
              />
            </Col>
            <Col md={6}>
              <InfoRow
                label="Phone Verified"
                value={<Badge bg={isPhoneVerified ? 'success' : 'danger'}>{isPhoneVerified ? 'Yes' : 'No'}</Badge>}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Address */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body>
          <h6 className="text-uppercase text-muted mb-3">Address</h6>
          <Row>
            <Col md={6}>
              <InfoRow label="Address Line 1" value={address_line1} />
              <InfoRow label="Address Line 2" value={address_line2} />
              <InfoRow label="City" value={city} />
            </Col>
            <Col md={6}>
              <InfoRow label="State" value={state} />
              <InfoRow label="Country" value={country} />
              <InfoRow label="Zip Code" value={zipCode} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Documents */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body>
          <h6 className="text-uppercase text-muted mb-3">Documents</h6>
          <Row className="g-3">
            {[
              { label: 'ID Front', path: documents?.idVerification?.front },
              { label: 'ID Back', path: documents?.idVerification?.back },
              { label: 'License Front', path: documents?.drivingLicense?.front },
              { label: 'License Back', path: documents?.drivingLicense?.back }
            ].map(({ label, path }) => (
              <Col md={3} sm={6} key={label} className="text-center">
                <div className="mb-2">
                  <strong>{label}</strong>
                </div>
                <FilePreview fileUrl={path} />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Vehicle Details */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body>
          <h6 className="text-uppercase text-muted mb-3">Vehicle Details</h6>
          <Row>
            <Col md={6}>
              <InfoRow label="Vehicle Type" value={documents?.vehicleDetails?.type} />
              <InfoRow label="Brand" value={documents?.vehicleDetails?.brand} />
              <InfoRow label="Model" value={documents?.vehicleDetails?.modelName} />
            </Col>
            <Col md={6}>
              <InfoRow label="Manufacture Year" value={documents?.vehicleDetails?.yearOfManufacture} />
              <InfoRow label="Registration No." value={documents?.vehicleDetails?.registrationNumber} />
              <InfoRow label="Number Plate" value={documents?.vehicleDetails?.numberPlate} />
            </Col>
          </Row>

          <Row className="mt-3 g-3">
            <Col md={3} sm={6} className="text-center">
              <div className="mb-2">
                <strong>Vehicle Photo</strong>
              </div>
              <FilePreview fileUrl={documents?.vehicleDetails?.vehiclePic} />
            </Col>
            <Col md={3} sm={6} className="text-center">
              <div className="mb-2">
                <strong>Registration Certificate</strong>
              </div>
              <FilePreview fileUrl={documents?.vehicleDetails?.registrationCertificate} />
            </Col>
            <Col md={3} sm={6} className="text-center">
              <div className="mb-2">
                <strong>Insurance Certificate</strong>
              </div>
              <FilePreview fileUrl={documents?.vehicleDetails?.insuranceCertificate} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

/* ================== MAIN COMPONENT ================== */

const DriverView = () => {
  const { id } = useParams();
  const { data: driverRes, isLoading: loading, isError, refetch } = useGetDriverByIdQuery(id);
  const [updateDriver, { isLoading: updateLoading }] = useUpdateDriverMutation();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const driver = driverRes?.data?.user;
  const shouldHideActionButtons =
    (driver?.status === 'active' && driver?.isDocumentVerified) || driver?.status === 'rejected' || driver?.status === 'inactive';

  const breadcrumbs = [
    { label: 'Driver Management', url: '/driver-management' },
    { label: 'View Driver', url: '#' }
  ];

  const handleApprove = async () => {
    try {
      await updateDriver({ id, payload: { status: 'active', isDocumentVerified: true } }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to approve driver:', err);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      await updateDriver({
        id,
        payload: { status: 'rejected', isDocumentVerified: false, rejectedReason: rejectReason }
      }).unwrap();
      refetch();
      setShowRejectModal(false);
      setRejectReason('');
    } catch (err) {
      console.error('Failed to reject driver:', err);
    }
  };

  if (isError) {
    return (
      <MainCard>
        <div className="text-center py-5">
          <h5 className="text-danger">Failed to load data</h5>
          <p className="text-muted">Something went wrong. Please try again later.</p>
        </div>
      </MainCard>
    );
  }

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: 20 }}>
      <MainCard>
        <TopTitleCard title="Driver Details" breadcrumbs={breadcrumbs} />
        <AutoSkeleton loading={loading || !driver}>
          <DriverContent
            driver={
              driver || {
                firstName: 'Loading',
                lastName: 'Driver',
                email: 'loading@example.com',
                phone: '+1234567890',
                status: 'active',
                isVerified: false,
                isDocumentVerified: false,
                isEmailVerified: false,
                isPhoneVerified: false,
                isOnline: false,
                isOnOrder: false,
                rating: 0,
                dob: '2000-01-01',
                gender: 'Male',
                profilePic: '',
                address_line1: 'Street Address',
                address_line2: 'Suite 100',
                city: 'City',
                state: 'State',
                country: 'Country',
                zipCode: '00000',
                createdAt: new Date().toISOString(),
                documents: {
                  idVerification: { front: '', back: '' },
                  drivingLicense: { front: '', back: '' },
                  vehicleDetails: {
                    type: 'Car',
                    brand: 'Brand',
                    modelName: 'Model',
                    yearOfManufacture: 2020,
                    registrationNumber: 'ABC123',
                    numberPlate: 'XYZ789',
                    vehiclePic: '',
                    registrationCertificate: '',
                    insuranceCertificate: ''
                  }
                }
              }
            }
          />
        </AutoSkeleton>

        {!loading && !shouldHideActionButtons && (
          <div className="mt-4 d-flex justify-content-center gap-2">
            <Button size="sm" variant="success" onClick={handleApprove} disabled={updateLoading}>
              Approve
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => setShowRejectModal(true)} disabled={updateLoading}>
              Reject
            </Button>
          </div>
        )}
      </MainCard>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter rejection reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={!rejectReason.trim() || updateLoading}>
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DriverView;
