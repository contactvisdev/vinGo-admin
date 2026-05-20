import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import AutoSkeleton from 'components/AutoSkeleton';
import TopTitleCard from '../../components/cards/CustomCard';
import { useGetOrderByIdQuery } from '../../store/api/orderApi';

/* ================== HELPERS ================== */

const InfoRow = React.memo(({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted">{label}</span>
    <span className="fw-semibold">{value || 'N/A'}</span>
  </div>
));

const statusColors = {
  pending: 'warning',
  merchant_accepted: 'info',
  confirmed: 'primary',
  preparing: 'info',
  ready_for_pickup: 'primary',
  at_restaurant: 'info',
  picked_up: 'primary',
  reached_drop: 'info',
  delivered: 'success',
  cancelled: 'danger',
  rejected: 'danger'
};

const getStatusBadge = (status) => (
  <Badge bg={statusColors[status] || 'secondary'}>{(status || 'unknown').replace(/_/g, ' ').toUpperCase()}</Badge>
);

const formatDate = (date) => (date ? new Date(date).toLocaleString() : 'N/A');

/* ================== MAIN COMPONENT ================== */

const OrderView = () => {
  const { id } = useParams();
  const { data: orderRes, isLoading, isError } = useGetOrderByIdQuery(id);
  const order = orderRes?.data || {
    _id: 'ORD000000',
    orderType: 'delivery',
    paymentStatus: 'pending',
    paymentMethod: 'card',
    originalAmount: '0.00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedAt: new Date().toISOString(),
    customerName: 'Loading Customer',
    customerNumber: '+1234567890',
    deliveryOtp: { verified: false },
    initialEtaMinutes: 30,
    initialDistanceKm: 5,
    ratings: { customerToDriver: { rating: null }, driverToCustomer: { rating: null } },
    order: {
      currency: 'USD',
      status: 'pending',
      businessName: 'Loading Business',
      ownerName: 'Loading Owner',
      branding: { storeLogo: '' },
      location: { complete_address: 'Full address here', pincode: '000000' },
      drop_location: { address_line1: 'Drop Address', city: 'City', state: 'State' },
      items: [
        {
          itemId: '1',
          itemName: 'Loading Item',
          itemType: 'food',
          itemPic: '',
          quantity: 1,
          unitPrice: '0.00',
          totalPrice: '0.00',
          currency: 'USD',
          variantName: '',
          selectedAddOns: []
        }
      ],
      subtotal: '0.00',
      tax: '0.00',
      tip: '0.00',
      totalAmount: '0.00',
      fees: [{ type: 'delivery', amount: '0.00' }],
      instructions: '',
      timeline: [{ status: 'pending', timestamp: new Date().toISOString() }]
    },
    driverDetails: {
      driverName: 'Loading Driver',
      contactNumber: '+1234567890',
      profilePic: '',
      rating: 0,
      totalReviews: 0,
      recentCustomerFeedback: ''
    }
  };

  const breadcrumbs = [
    { label: 'Order Management', url: '/order-management' },
    { label: 'View Order', url: '#' }
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

  const merchantOrder = order?.order;
  const driver = order?.driverDetails;

  return (
    <div style={{ backgroundColor: '#f8f9fb', minHeight: '100vh', padding: 20 }}>
      <MainCard>
        <TopTitleCard title="Order Details" breadcrumbs={breadcrumbs} />

        <AutoSkeleton loading={isLoading || !order}>
          <div>
            {/* ================= ORDER OVERVIEW ================= */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-uppercase text-muted mb-3">Order Overview</h6>
                <Row>
                  <Col md={6}>
                    <InfoRow label="Order ID" value={order._id} />
                    <InfoRow label="Order Type" value={<Badge bg="primary">{(order.orderType || 'N/A').toUpperCase()}</Badge>} />
                    <InfoRow label="Payment Status" value={getStatusBadge(order.paymentStatus)} />
                    <InfoRow label="Payment Method" value={order.paymentMethod} />
                  </Col>
                  <Col md={6}>
                    <InfoRow label="Original Amount" value={`${merchantOrder?.currency || ''} ${order.originalAmount}`} />
                    <InfoRow label="Created At" value={formatDate(order.createdAt)} />
                    <InfoRow label="Updated At" value={formatDate(order.updatedAt)} />
                    <InfoRow label="Assigned At" value={formatDate(order.assignedAt)} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= CUSTOMER INFO ================= */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-uppercase text-muted mb-3">Customer Information</h6>
                <Row>
                  <Col md={6}>
                    <InfoRow label="Customer Name" value={order.customerName || 'N/A'} />
                    <InfoRow label="Phone" value={order.customerNumber} />
                  </Col>
                  <Col md={6}>
                    <InfoRow
                      label="Delivery OTP Verified"
                      value={
                        <Badge bg={order.deliveryOtp?.verified ? 'success' : 'danger'}>{order.deliveryOtp?.verified ? 'Yes' : 'No'}</Badge>
                      }
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= MERCHANT INFO ================= */}
            {merchantOrder && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <h6 className="text-uppercase text-muted mb-3">Merchant Information</h6>
                  <Row className="align-items-center mb-3">
                    {merchantOrder.branding?.storeLogo && (
                      <Col md="auto">
                        <img
                          src={merchantOrder.branding.storeLogo}
                          alt="Store Logo"
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                        />
                      </Col>
                    )}
                    <Col>
                      <h5 className="mb-1">{merchantOrder.businessName || 'N/A'}</h5>
                      <span className="text-muted">Owner: {merchantOrder.ownerName || 'N/A'}</span>
                    </Col>
                    <Col md="auto">{getStatusBadge(merchantOrder.status)}</Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <InfoRow label="Pickup Address" value={merchantOrder.location?.complete_address} />
                      <InfoRow label="Pincode" value={merchantOrder.location?.pincode} />
                    </Col>
                    <Col md={6}>
                      <InfoRow
                        label="Drop Location"
                        value={
                          [
                            merchantOrder.drop_location?.address_line1,
                            merchantOrder.drop_location?.city,
                            merchantOrder.drop_location?.state
                          ]
                            .filter(Boolean)
                            .join(', ') || 'N/A'
                        }
                      />
                      <InfoRow label="ETA" value={order.initialEtaMinutes ? `${order.initialEtaMinutes} mins` : null} />
                      <InfoRow label="Distance" value={order.initialDistanceKm ? `${order.initialDistanceKm} km` : null} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* ================= DRIVER INFO ================= */}
            {driver && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <h6 className="text-uppercase text-muted mb-3">Driver Details</h6>
                  <Row className="align-items-center">
                    <Col md="auto">
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: '#e9ecef',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {driver.profilePic ? (
                          <img src={driver.profilePic} alt="Driver" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 20, fontWeight: 600 }}>{driver.driverName?.[0] || '?'}</span>
                        )}
                      </div>
                    </Col>
                    <Col>
                      <Row>
                        <Col md={6}>
                          <InfoRow label="Name" value={driver.driverName} />
                          <InfoRow label="Phone" value={driver.contactNumber} />
                        </Col>
                        <Col md={6}>
                          <InfoRow label="Rating" value={driver.rating ? `${driver.rating} / 5` : null} />
                          <InfoRow label="Total Reviews" value={driver.totalReviews} />
                        </Col>
                      </Row>
                      {driver.recentCustomerFeedback && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-muted">Recent Feedback:</small>
                          <div className="fw-semibold">{driver.recentCustomerFeedback}</div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* ================= ORDER ITEMS ================= */}
            {merchantOrder && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <h6 className="text-uppercase text-muted mb-3">Order Items</h6>
                  {merchantOrder.items?.map((item) => (
                    <Card key={item.itemId} className="mb-3 p-3">
                      <Row className="align-items-center">
                        <Col md={2}>
                          {item.itemPic ? (
                            <img
                              src={item.itemPic}
                              alt={item.itemName}
                              style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: 8,
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #ddd'
                              }}
                            >
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                              </svg>
                            </div>
                          )}
                        </Col>
                        <Col md={7}>
                          <h6 className="mb-1">{item.itemName}</h6>
                          <div className="text-muted mb-1">
                            <Badge bg="light" text="dark" className="me-2">
                              {item.itemType}
                            </Badge>
                            {item.variantName && (
                              <Badge bg="primary" className="border">
                                Variant: {item.variantName}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <small>
                              Qty: <strong>{item.quantity}</strong> &nbsp;|&nbsp; Unit Price:{' '}
                              <strong>
                                {item.currency} {item.unitPrice}
                              </strong>
                            </small>
                          </div>
                          {item.selectedAddOns?.length > 0 && (
                            <div className="mt-1">
                              <small className="text-muted">Add-ons:</small>
                              <ul className="mb-0 ps-3">
                                {item.selectedAddOns.map((a, i) => (
                                  <li key={i}>
                                    <small>
                                      {a.addOnName} ({a.quantity} x {a.addOnPrice})
                                    </small>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Col>
                        <Col md={3} className="text-end">
                          <h5 className="mb-0">
                            {item.currency} {item.totalPrice}
                          </h5>
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  {/* ================= PRICE BREAKDOWN ================= */}
                  <Card className="bg-light border-0 mt-3">
                    <Card.Body>
                      <h6 className="text-uppercase text-muted mb-3">Price Breakdown</h6>
                      <InfoRow label="Subtotal" value={`${merchantOrder.currency} ${merchantOrder.subtotal}`} />
                      {merchantOrder.fees?.map((fee, i) => (
                        <InfoRow
                          key={i}
                          label={`${fee.type.charAt(0).toUpperCase() + fee.type.slice(1)} Fee`}
                          value={`${merchantOrder.currency} ${fee.amount}`}
                        />
                      ))}
                      <InfoRow label="Tax" value={`${merchantOrder.currency} ${merchantOrder.tax}`} />
                      <InfoRow label="Tip" value={`${merchantOrder.currency} ${merchantOrder.tip}`} />
                      <div className="d-flex justify-content-between py-2 mt-1" style={{ borderTop: '2px solid #dee2e6' }}>
                        <span className="fw-bold">Total</span>
                        <span className="fw-bold fs-5">
                          {merchantOrder.currency} {merchantOrder.totalAmount}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>

                  {merchantOrder.instructions && (
                    <div className="mt-3 p-2 bg-light rounded">
                      <small className="text-muted">Special Instructions:</small>
                      <div className="fw-semibold">{merchantOrder.instructions}</div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* ================= TIMELINE ================= */}
            {merchantOrder?.timeline?.length > 0 && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <h6 className="text-uppercase text-muted mb-3">Order Timeline</h6>
                  <div style={{ paddingBottom: 16, paddingTop: 16 }}>
                    <div className="d-flex align-items-start">
                      {merchantOrder.timeline
                        .filter((t) => !['confirmed', 'at_restaurant'].includes(t.status))
                        .map((t, i, arr) => {
                          const isLast = i === arr.length - 1;
                          const isCurrent = i === arr.length - 1;
                          const isPending = i > arr.length - 1;
                          const dotColor = isCurrent ? '#198754' : isPending ? '#adb5bd' : '#ffc107';
                          const lineColor = isPending ? '#adb5bd' : '#ffc107';
                          return (
                            <div key={i} className="d-flex align-items-start" style={{ flex: isLast ? '0 0 auto' : '1 1 0' }}>
                              <div className="d-flex flex-column align-items-center" style={{ minWidth: 110 }}>
                                <div
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: dotColor,
                                    border: '3px solid #fff',
                                    boxShadow: `0 0 0 2px ${dotColor}`,
                                    zIndex: 1
                                  }}
                                />
                                <div className="text-center mt-2" style={{ maxWidth: 120, padding: '0 4px' }}>
                                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>
                                    {t.status.replace(/_/g, ' ').toUpperCase()}
                                  </div>
                                  <div style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
                                    {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                  <div style={{ fontSize: 10, color: '#adb5bd', marginTop: 2 }}>
                                    {new Date(t.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              {!isLast && (
                                <div
                                  style={{
                                    flex: 1,
                                    height: 3,
                                    backgroundColor: lineColor,
                                    marginTop: 8.5,
                                    minWidth: 40,
                                    borderRadius: 2
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* ================= RATINGS ================= */}
            {(order.ratings?.customerToDriver?.rating || order.ratings?.driverToCustomer?.rating) && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <h6 className="text-uppercase text-muted mb-3">Ratings</h6>
                  <Row>
                    <Col md={6}>
                      <InfoRow label="Customer → Driver" value={order.ratings.customerToDriver?.rating ?? 'Not rated'} />
                    </Col>
                    <Col md={6}>
                      <InfoRow label="Driver → Customer" value={order.ratings.driverToCustomer?.rating ?? 'Not rated'} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </div>
        </AutoSkeleton>
      </MainCard>
    </div>
  );
};

export default OrderView;
