import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import AutoSkeleton from 'components/AutoSkeleton';
import TopTitleCard from '../../shared/CustomCard';
import { useGetMerchantByIdQuery, useApproveMerchantMutation, useRejectMerchantMutation } from '../../store/api/merchantApi';

const MerchantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data: merchant, isLoading: loading, isError } = useGetMerchantByIdQuery(id);
  const [approveMerchant, { isLoading: approving }] = useApproveMerchantMutation();
  const [rejectMerchant, { isLoading: rejecting }] = useRejectMerchantMutation();

  const actionLoading = approving || rejecting;

  const breadcrumbs = [
    { label: 'Merchant Management', url: '/merchant-management/restaurants' },
    { label: 'Restaurants', url: '/merchant-management/restaurants' },
    { label: 'View Restaurant', url: `/merchant-management/restaurants/view/${id}` }
  ];

  const handleApprove = async () => {
    try {
      await approveMerchant({ id, payload: { status: 'approved' } }).unwrap();
      navigate('/merchant-management');
    } catch (err) {
      console.error('Failed to approve merchant:', err);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      return;
    }
    try {
      await rejectMerchant({ id, payload: { status: 'rejected', rejectedReason: rejectReason } }).unwrap();
      setShowRejectModal(false);
      navigate('/merchant-management');
    } catch (err) {
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

  const FilePreview = ({ fileUrl, label }) => {
    if (!fileUrl) return <p className="text-muted">No {label} uploaded.</p>;

    const isPDF = fileUrl.toLowerCase().endsWith('.pdf');

    return (
      <div className="mt-2">
        <strong>{label}:</strong>
        {isPDF ? (
          <div className="mt-2">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
              View PDF
            </a>
          </div>
        ) : (
          <div
            className="mt-2 border rounded shadow-sm d-flex align-items-center justify-content-center"
            style={{
              width: '150px',
              height: '150px',
              backgroundColor: '#f8f9fa',
              overflow: 'hidden'
            }}
          >
            <img
              src={fileUrl}
              alt={label}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const { ownerName, email, phone, categoryId, business, ownerVerification, status } = merchant || {
    ownerName: 'Loading Owner',
    email: 'loading@example.com',
    phone: '+1234567890',
    categoryId: 'cat123',
    status: 'pending',
    business: {
      businessName: 'Loading Business',
      location: { pincode: '000000', plot_no: '1', floor: '1', building_name: 'Building', complete_address: 'Full address here' },
      hours: [{ day: 'Monday', open: '09:00', close: '18:00' }],
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
  const isPending = status === 'pending';

  return (
    <div style={{ backgroundColor: '#f8f9fb', minHeight: '100vh', padding: '20px' }}>
      <MainCard>
        <div className="mb-4">
          <TopTitleCard title="View Merchant" breadcrumbs={breadcrumbs} />
        </div>
        <AutoSkeleton loading={loading || !merchant}>
          <div>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="fw-bold">Owner Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <strong>Owner Name:</strong> {ownerName}
                  </Col>
                  <Col md={6}>
                    <strong>Email:</strong> {email}
                  </Col>
                  <Col md={6}>
                    <strong>Phone:</strong> {phone}
                  </Col>
                  <Col md={6}>
                    <strong>Category ID:</strong> {categoryId}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Header className="fw-bold">Business Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <strong>Business Name:</strong> {business?.businessName}
                  </Col>
                  <Col md={6}>
                    <strong>Pincode:</strong> {business?.location?.pincode}
                  </Col>
                  <Col md={6}>
                    <strong>Plot No:</strong> {business?.location?.plot_no}
                  </Col>
                  <Col md={6}>
                    <strong>Floor:</strong> {business?.location?.floor}
                  </Col>
                  <Col md={6}>
                    <strong>Building:</strong> {business?.location?.building_name}
                  </Col>
                  <Col md={6}>
                    <strong>Address:</strong> {business?.location?.complete_address}
                  </Col>
                  {/* <Col md={6}>
                <strong>Landmark:</strong> {business?.location?.landmark}
              </Col> */}
                </Row>

                <hr />
                <h6>Working Hours</h6>
                {business?.hours?.length ? (
                  <ul>
                    {business.hours.map((h, i) => {
                      const openTime = h.open
                        ? new Date(`1970-01-01T${h.open}Z`).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '-';

                      const closeTime = h.close
                        ? new Date(`1970-01-01T${h.close}Z`).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '-';

                      return (
                        <li key={i}>
                          <strong>{h.day}</strong>: {openTime} - {closeTime}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-muted">No working hours set.</p>
                )}

                <hr />
                <h6>Verification</h6>
                <Row>
                  <Col md={6}>
                    <strong>Registration No:</strong> {business?.verification?.registrationNumber}
                  </Col>
                  <Col md={6}>
                    <strong>Tax ID:</strong> {business?.verification?.taxIdentificationNumber}
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col md={6}>
                    <strong>Registration Certificate:</strong>{' '}
                    {business?.verification?.registrationCertificateUrl && (
                      <a href={business.verification.registrationCertificateUrl} target="_blank" rel="noreferrer">
                        View Document
                      </a>
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>Business Document:</strong>{' '}
                    {business?.verification?.businessDocumentUrl && (
                      <a href={business.verification.businessDocumentUrl} target="_blank" rel="noreferrer">
                        View Document
                      </a>
                    )}
                  </Col>
                </Row>

                <hr />
                <h6>Branding</h6>
                <Row>
                  <Col md={6}>
                    <FilePreview fileUrl={business?.branding?.storeLogo} label="Store Logo" />
                  </Col>
                  <Col md={6}>
                    <FilePreview fileUrl={business?.branding?.storePic} label="Store Picture" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Header className="fw-bold">Owner Verification</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <FilePreview fileUrl={ownerVerification?.idProofUrl} label="ID Proof" />
                  </Col>
                  <Col md={6}>
                    <FilePreview fileUrl={ownerVerification?.selfieUrl} label="Selfie" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="text-center">
              {isPending && (
                <>
                  <Button variant="success" onClick={handleApprove} disabled={actionLoading} className="me-2">
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button variant="danger" onClick={() => setShowRejectModal(true)} disabled={actionLoading} className="me-2">
                    Reject
                  </Button>
                </>
              )}
              <Button variant="secondary" onClick={() => navigate('/merchant-management')}>
                Back to List
              </Button>
              <Button variant="warning" className="ms-2" onClick={() => navigate(`/merchant-management/edit/${id}`)}>
                Edit Merchant
              </Button>
            </div>
          </div>
        </AutoSkeleton>
      </MainCard>

      {/* Rejection Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Merchant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Please provide a reason for rejecting this merchant..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowRejectModal(false);
              setRejectReason('');
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectSubmit} disabled={actionLoading || !rejectReason.trim()}>
            {actionLoading ? 'Processing...' : 'Confirm Rejection'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MerchantView;
