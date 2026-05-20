import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import AutoSkeleton from 'components/AutoSkeleton';
import TopTitleCard from '../../../components/cards/CustomCard';
import { useApproveMerchantMutation, useGetMerchantByIdQuery, useRejectMerchantMutation } from '../../../store/api/merchantApi';

/* ================= Info Item ================= */

const InfoItem = React.memo(({ label, value }) => (
  <div className="mb-3">
    <div className="text-muted small">{label}</div>
    <div className="fw-semibold">{value || 'Not Available'}</div>
  </div>
));

/* ================= File Preview ================= */

const FilePreview = React.memo(({ fileUrl, label }) => {
  if (!fileUrl) return <div className="text-muted">No {label}</div>;

  const isPDF = fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="mb-3">
      <div className="text-muted small mb-1">{label}</div>
      {isPDF ? (
        <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
          View PDF
        </a>
      ) : (
        <a href={fileUrl} target="_blank" rel="noreferrer">
          <img
            src={fileUrl}
            alt={label}
            style={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #ddd'
            }}
          />
        </a>
      )}
    </div>
  );
});

/* ================= MAIN ================= */

const RestaurantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  const { data: merchant, isLoading: loading, isError } = useGetMerchantByIdQuery(id, { skip: isNavigatingAway });
  const [approveMerchant, { isLoading: isApproving }] = useApproveMerchantMutation();
  const [rejectMerchant, { isLoading: isRejecting }] = useRejectMerchantMutation();

  const actionLoading = isApproving || isRejecting;
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState('');

  const breadcrumbs = [
    { label: 'Restaurants', url: '/merchant-management/restaurants' },
    { label: 'View Restaurant', url: '#' }
  ];

  const handleApprove = async () => {
    try {
      await approveMerchant({ id, payload: { status: 'approved', isDocumentVerified: true } }).unwrap();
      navigate('/merchant-management/restaurants');
    } catch (err) {
      console.error('Failed to approve merchant:', err);
    }
  };

  const handleRejectSubmit = async () => {
    if (!reason.trim()) return;
    try {
      // Mark as navigating away to skip query
      setIsNavigatingAway(true);

      await rejectMerchant({ id, payload: { status: 'rejected', rejectedReason: reason } }).unwrap();

      setShowRejectModal(false);
      // Navigate immediately to prevent any refetch attempts
      navigate('/merchant-management/restaurants', { replace: true });
    } catch (err) {
      setIsNavigatingAway(false);
      console.error('Failed to reject merchant:', err);
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

  const data = merchant?.data || merchant || {};
  const { categoryName, rating, business, ownerVerification, status, isProfileCompleted } = data?.merchant || {
    categoryName: 'Restaurant',
    rating: 0,
    status: 'pending',
    business: {
      businessName: 'Loading Business',
      location: { plot_no: '1', floor: '1', building_name: 'Building', pincode: '000000', complete_address: 'Full address here' },
      hours: [{ _id: 'h1', day: 'Monday', open: '09:00', close: '18:00' }],
      verification: {
        registrationNumber: 'REG123',
        taxIdentificationNumber: 'TIN123',
        registrationCertificateUrl: '',
        businessDocumentUrl: ''
      },
      branding: { storeLogo: '', storePic: '' }
    },
    ownerVerification: { idProofUrl: '', selfieUrl: '' }
  };
  const { ownerName, email, phone } = data?.ownerDetails || {
    ownerName: 'Loading Owner',
    email: 'loading@example.com',
    phone: '+1234567890'
  };
  const isPending = status === 'pending' && isProfileCompleted === true;

  return (
    <div style={{ background: '#f8f9fb', minHeight: '100vh', padding: 20 }}>
      <MainCard>
        <TopTitleCard title="Restaurant Review" breadcrumbs={breadcrumbs} />
        <AutoSkeleton loading={loading || !merchant}>
          <div>
            {/* ================= Sticky Header ================= */}
            <Card className="mt-3 mb-4 shadow-sm border-0" style={{ position: 'sticky', top: 80, zIndex: 10 }}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">{business?.businessName}</h4>
                  <div className="text-muted small">{email}</div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {/* <Badge className="badge" bg={status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger'}>
                {status.toUpperCase()}
              </Badge> */}
                  <Badge
                    className="custom-badge"
                    style={{ padding: '10px 10px' }}
                    bg={status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger'}
                  >
                    {status?.toUpperCase()}
                  </Badge>

                  {/* <Button size="sm" variant="outline-secondary" onClick={() => navigate('/merchant-management/restaurants')}>
                Back
              </Button> */}
                </div>
              </Card.Body>
            </Card>

            {/* ================= Owner Details ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Owner Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <InfoItem label="Owner Name" value={ownerName} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Email" value={email} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Phone" value={phone} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Category" value={categoryName} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Rating" value={rating} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= Business Details ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Business Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <InfoItem label="Plot No" value={business?.location?.plot_no} />
                  </Col>
                  <Col md={3}>
                    <InfoItem label="Floor" value={business?.location?.floor} />
                  </Col>
                  <Col md={3}>
                    <InfoItem label="Building" value={business?.location?.building_name} />
                  </Col>
                  <Col md={3}>
                    <InfoItem label="Pincode" value={business?.location?.pincode} />
                  </Col>
                  <Col md={12}>
                    <InfoItem label="Full Address" value={business?.location?.complete_address} />
                  </Col>
                </Row>

                <hr />

                <h6>Working Hours</h6>
                {business?.hours?.length ? (
                  business.hours.map((h) => (
                    <div key={h._id}>
                      <strong>{h.day}</strong>: {h.open} - {h.close}
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No working hours provided</div>
                )}
              </Card.Body>
            </Card>

            {/* ================= Verification ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Business Verification</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <InfoItem label="Registration Number" value={business?.verification?.registrationNumber} />
                  </Col>
                  <Col md={6}>
                    <InfoItem label="Tax Identification Number" value={business?.verification?.taxIdentificationNumber} />
                  </Col>
                  <Col md={6}>
                    <FilePreview label="Registration Certificate" fileUrl={business?.verification?.registrationCertificateUrl} />
                  </Col>
                  <Col md={6}>
                    <FilePreview label="Business Document" fileUrl={business?.verification?.businessDocumentUrl} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= Branding ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Branding</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <FilePreview label="Store Logo" fileUrl={business?.branding?.storeLogo} />
                  </Col>
                  <Col md={6}>
                    <FilePreview label="Store Image" fileUrl={business?.branding?.storePic} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= Owner Verification ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Owner Verification</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <FilePreview label="ID Proof" fileUrl={ownerVerification?.idProofUrl} />
                  </Col>
                  <Col md={6}>
                    <FilePreview label="Selfie" fileUrl={ownerVerification?.selfieUrl} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {isPending && (
              <div className="d-flex gap-2 justify-content-center">
                <Button size="sm" variant="success" onClick={handleApprove} disabled={actionLoading}>
                  Approve
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => setShowRejectModal(true)} disabled={actionLoading}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        </AutoSkeleton>
      </MainCard>

      {/* ================= Reject Modal ================= */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter rejection reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectSubmit} disabled={!reason.trim()}>
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestaurantView;
