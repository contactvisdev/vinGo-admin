import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import AutoSkeleton from 'components/AutoSkeleton';
import TopTitleCard from '../../components/cards/CustomCard';
import { useGetCustomerByIdQuery } from '../../store/api/customerApi';

/* ---------- Small Reusable Components ---------- */

const InfoRow = React.memo(({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted">{label}</span>
    <span className="fw-semibold">{value || 'Not avilable'}</span>
  </div>
));

/* ---------- Main Component ---------- */

const CustomerView = () => {
  const { id } = useParams();

  const { data: customerData, isLoading: loading, isError } = useGetCustomerByIdQuery(id);
  const customer = customerData?.data?.user || customerData?.user || customerData?.data || customerData;

  const breadcrumbs = [
    { label: 'Customer Management', url: '/customer-management' },
    { label: 'View Customer', url: `/customer-management/view/${id}` }
  ];

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
        <TopTitleCard title="Customer Details" breadcrumbs={breadcrumbs} />

        <AutoSkeleton loading={loading || !customer}>
          <CustomerContent
            customer={
              customer || {
                firstName: 'Loading',
                lastName: 'User',
                email: 'loading@example.com',
                phone: '+1234567890',
                status: 'active',
                gender: 'Male',
                dob: '2000-01-01',
                idNumber: '000000',
                country: 'Country',
                baseCurrency: 'USD',
                locale: 'en-US',
                profilePic: ''
              }
            }
          />
        </AutoSkeleton>
      </MainCard>
    </div>
  );
};

/* ---------- Content ---------- */

const CustomerContent = ({ customer }) => {
  const { firstName, lastName, email, phone, status, gender, dob, idNumber, country, baseCurrency, locale, profilePic } = customer;

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <Card.Body>
        <Row className="align-items-center mb-4">
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
                fontWeight: 600,
                color: '#6c757d'
              }}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <>
                  {firstName?.[0]}
                  {lastName?.[0]}
                </>
              )}
            </div>
          </Col>

          <Col>
            <h4 className="mb-1">
              {firstName && lastName ? `${firstName} ${lastName}` : firstName ? firstName : lastName ? lastName : 'Not Available'}
            </h4>

            <div className="text-muted mb-2">{email || 'Not Available'}</div>

            <Badge bg={status === 'active' ? 'success' : 'secondary'}>{(status || 'not available').toUpperCase()}</Badge>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <h6 className="text-uppercase text-muted mb-3">Personal Information</h6>
            <InfoRow label="Phone" value={phone} />
            <InfoRow label="Gender" value={gender} />
            <InfoRow label="Date of Birth" value={dob ? new Date(dob).toLocaleDateString() : 'Not avilable'} />
            <InfoRow label="ID Number" value={idNumber} />
          </Col>

          <Col md={6}>
            <h6 className="text-uppercase text-muted mb-3">Account Information</h6>
            <InfoRow label="Country" value={country} />
            <InfoRow label="Base Currency" value={baseCurrency} />
            <InfoRow label="Locale" value={locale} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CustomerView;
