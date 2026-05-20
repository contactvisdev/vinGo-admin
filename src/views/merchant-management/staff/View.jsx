import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import AutoSkeleton from 'components/AutoSkeleton';
import TopTitleCard from '../../../components/cards/CustomCard';
import { useGetBusinessStaffByIdQuery } from '../../../store/api/Staff';

/* ================= Helpers ================= */

const InfoItem = React.memo(({ label, value }) => (
  <div className="mb-3">
    <div className="text-muted small">{label}</div>
    <div className="fw-semibold">{value || 'Not Available'}</div>
  </div>
));

const FilePreview = React.memo(({ label, fileUrl }) => {
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

const StaffView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetBusinessStaffByIdQuery(id);

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

  const staff = data?.data || data || {};

  const {
    name,
    email,
    phone,
    ownerId,
    profilePic,
    idVerification,
    roles = [],
    createdAt
  } = staff?.name
    ? staff
    : {
        name: 'Loading Staff',
        email: 'loading@example.com',
        phone: '+1234567890',
        ownerId: 'owner123',
        profilePic: '',
        createdAt: new Date().toISOString(),
        idVerification: { front: '', back: '' },
        roles: [
          {
            role: 'staff',
            permissions: {
              orders: { view: true, manage: false },
              menu: { view: true, manage: false },
              staff: { view: true, manage: false }
            }
          }
        ]
      };
  const [{ permissions = {} } = {}] = roles;

  return (
    <div style={{ background: '#f8f9fb', minHeight: '100vh', padding: 20 }}>
      <MainCard>
        <TopTitleCard title="Staff Details" />
        <AutoSkeleton loading={isLoading || !data}>
          <div>
            {/* ================= Header ================= */}
            <Card className="mt-3 mb-4 shadow-sm border-0">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">{name}</h4>
                  <div className="text-muted small">{email}</div>
                </div>
                <Badge bg="primary">STAFF</Badge>
              </Card.Body>
            </Card>

            {/* ================= Basic Info ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Basic Information</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <InfoItem label="Name" value={name} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Email" value={email} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Phone" value={phone} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Owner ID" value={ownerId} />
                  </Col>
                  <Col md={4}>
                    <InfoItem label="Created At" value={new Date(createdAt).toLocaleDateString('en-GB')} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= Profile ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Profile</Card.Header>
              <Card.Body>
                <FilePreview label="Profile Picture" fileUrl={profilePic} />
              </Card.Body>
            </Card>

            {/* ================= ID Verification ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">ID Verification</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <FilePreview label="ID Front" fileUrl={idVerification?.front} />
                  </Col>
                  <Col md={6}>
                    <FilePreview label="ID Back" fileUrl={idVerification?.back} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= Roles & Permissions ================= */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Roles & Permissions</Card.Header>
              <Card.Body>
                {roles.length ? (
                  roles.map((r, index) => (
                    <div key={index} className="mb-4 pb-3" style={{ borderBottom: index < roles.length - 1 ? '1px solid #eee' : 'none' }}>
                      <div className="mb-3">
                        <h6 className="mb-2">Role</h6>
                        <Badge bg="primary">{r.role}</Badge>
                      </div>

                      {r.permissions && Object.keys(r.permissions).length > 0 && (
                        <div>
                          <h6 className="mb-3">Permissions</h6>
                          <Row>
                            {Object.entries(r.permissions).map(([category, categoryPermissions]) => {
                              // Skip if the value is not an object (for backward compatibility)
                              if (typeof categoryPermissions !== 'object' || categoryPermissions === null) {
                                return null;
                              }

                              return (
                                <Col md={6} lg={4} key={category} className="mb-4">
                                  <div className="p-3" style={{ border: '1px solid #e9ecef', borderRadius: 6, backgroundColor: '#f8f9fa' }}>
                                    {/* Permission Category Title */}
                                    <h6 className="mb-3 text-primary fw-semibold" style={{ textTransform: 'capitalize' }}>
                                      {category.replace(/([A-Z])/g, ' $1').trim()}
                                    </h6>

                                    {/* Permission Checkboxes */}
                                    <div className="d-flex flex-column gap-2">
                                      {Object.entries(categoryPermissions).map(([permKey, permValue]) => (
                                        <div key={permKey} className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`perm_${index}_${category}_${permKey}`}
                                            checked={permValue === true}
                                            disabled
                                          />
                                          <label className="form-check-label" htmlFor={`perm_${index}_${category}_${permKey}`}>
                                            {permKey
                                              .replace(/([A-Z])/g, ' $1')
                                              .replace(/^./, (str) => str.toUpperCase())
                                              .trim()}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No roles assigned</div>
                )}
              </Card.Body>
            </Card>
          </div>
        </AutoSkeleton>
      </MainCard>
    </div>
  );
};

export default StaffView;
