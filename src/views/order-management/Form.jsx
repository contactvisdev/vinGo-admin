import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { Form, Button, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import MainCard from 'components/MainCard';
import TopTitleCard from '../../components/cards/CustomCard';
import { requiredField } from '../../utils/validationSchema';
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '../../store/api/orderApi';
import LoadingOverlay from 'components/LoadingOverlay';
import TextArea from 'components/form/TextArea';
import NumberInput from 'components/form/NumberInput';

const InfoRow = React.memo(({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted">{label}</span>
    <span className="fw-semibold">{value || 'N/A'}</span>
  </div>
));

const OrderEditForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'pending';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const navigate = useNavigate();

  const { data: orderRes, isLoading: isFetching } = useGetOrderByIdQuery(id);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      instructions: '',
      items: []
    }
  });
  const { handleSubmit, reset, control, watch } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'items'
  });

  const loading = isFetching || isUpdating;

  const orderData = orderRes?.data;
  const order = orderData?.order;

  useEffect(() => {
    if (!orderData || !order) return;

    reset({
      instructions: order.instructions || '',
      items:
        order.items?.map((i) => ({
          itemId: i.itemId,
          itemName: i.itemName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
          itemPic: i.itemPic,
          variantName: i.variantName,
          selectedAddOns: i.selectedAddOns
        })) || []
    });
  }, [orderData, order, reset]);

  const onSubmit = async (formData) => {
    const payload = {
      ...orderData,
      order: {
        ...order,
        instructions: formData.instructions,
        items: order.items.map((item, index) => ({
          ...item,
          quantity: Number(formData.items[index]?.quantity ?? item.quantity)
        }))
      }
    };

    try {
      await updateOrder({ id, payload }).unwrap();
      navigate(`/order-management?tab=${tabFromUrl}&page=${page}&rows=${rows}`);
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const breadcrumbs = [
    { label: 'Order Management', url: '/order-management' },
    { label: 'Edit Order', url: `/order-management/edit/${id}` }
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusColor = (status) => {
    const map = {
      pending: 'warning',
      preparing: 'info',
      confirmed: 'primary',
      ready_for_pickup: 'info',
      at_restaurant: 'info',
      picked_up: 'primary',
      reached_drop: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return map[status] || 'secondary';
  };

  return (
    <MainCard>
      <TopTitleCard title="Edit Order" breadcrumbs={breadcrumbs} />

      <div className="position-relative">
        {loading && <LoadingOverlay />}

        {orderData && order && (
          <div className={loading ? 'opacity-50 pe-none' : ''}>
            {/* Order Summary */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Order Summary</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <InfoRow label="Order ID" value={orderData._id} />
                    <InfoRow label="Order Type" value={orderData.orderType} />
                    <InfoRow
                      label="Payment Status"
                      value={
                        <Badge bg={orderData.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {(orderData.paymentStatus || 'pending').toUpperCase()}
                        </Badge>
                      }
                    />
                    <InfoRow
                      label="Status"
                      value={<Badge bg={statusColor(order.status)}>{(order.status || '').replace(/_/g, ' ').toUpperCase()}</Badge>}
                    />
                  </Col>
                  <Col md={6}>
                    <InfoRow label="Created At" value={formatDate(orderData.createdAt)} />
                    <InfoRow label="Distance" value={orderData.initialDistanceKm ? `${orderData.initialDistanceKm} km` : 'N/A'} />
                    <InfoRow label="ETA" value={orderData.initialEtaMinutes ? `${orderData.initialEtaMinutes} min` : 'N/A'} />
                    <InfoRow label="Currency" value={order.currency} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Customer & Driver */}
            <Row className="mb-4">
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="fw-semibold">Customer</Card.Header>
                  <Card.Body>
                    <InfoRow label="Name" value={orderData.customerName} />
                    <InfoRow label="Phone" value={orderData.customerNumber} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="fw-semibold">Driver</Card.Header>
                  <Card.Body>
                    {orderData.driverDetails ? (
                      <>
                        <InfoRow label="Name" value={orderData.driverDetails.driverName} />
                        <InfoRow label="Phone" value={orderData.driverDetails.contactNumber} />
                        <InfoRow label="Rating" value={orderData.driverDetails.rating} />
                      </>
                    ) : (
                      <p className="text-muted mb-0">No driver assigned</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Merchant & Location */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Merchant</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <InfoRow label="Owner" value={order.ownerName} />
                    <InfoRow label="Business" value={order.businessName} />
                  </Col>
                  <Col md={6}>
                    <InfoRow label="Address" value={order.location?.complete_address} />
                    <InfoRow label="Pincode" value={order.location?.pincode} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Fees & Totals */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="fw-semibold">Pricing</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <InfoRow label="Subtotal" value={`${order.currency} ${order.subtotal}`} />
                    <InfoRow label="Tax" value={`${order.currency} ${order.tax}`} />
                    <InfoRow label="Tip" value={`${order.currency} ${order.tip?.toFixed(2)}`} />
                  </Col>
                  <Col md={6}>
                    {order.fees?.map((fee, i) => (
                      <InfoRow key={i} label={`${fee.type} Fee`} value={`${order.currency} ${fee.amount}`} />
                    ))}
                    <InfoRow
                      label="Total Amount"
                      value={
                        <strong>
                          {order.currency} {order.totalAmount?.toFixed(2)}
                        </strong>
                      }
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Timeline */}
            {order.timeline?.length > 0 && (
              <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="fw-semibold">Order Timeline</Card.Header>
                <Card.Body>
                  <div className="position-relative" style={{ paddingLeft: 32 }}>
                    {order.timeline.map((t, i) => {
                      const isLast = i === order.timeline.length - 1;
                      const isFirst = i === 0;
                      return (
                        <div key={i} className="d-flex align-items-start mb-0" style={{ minHeight: isLast ? 'auto' : 56 }}>
                          {/* Vertical line + dot */}
                          <div
                            className="position-absolute"
                            style={{
                              left: 12,
                              top: 0,
                              bottom: 0,
                              width: 2,
                              background: '#dee2e6'
                            }}
                          />
                          <div
                            className="position-absolute d-flex align-items-center justify-content-center"
                            style={{
                              left: 4,
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: isLast ? '#198754' : isFirst ? '#0d6efd' : '#dee2e6',
                              border: `2px solid ${isLast ? '#198754' : isFirst ? '#0d6efd' : '#adb5bd'}`,
                              zIndex: 1
                            }}
                          >
                            {isLast && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>

                          {/* Content */}
                          <div className="ms-3 pb-3" style={{ borderBottom: isLast ? 'none' : '1px dashed #eee', width: '100%' }}>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                                {t.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>
                              <Badge
                                bg={statusColor(t.status)}
                                className="bg-opacity-10"
                                style={{
                                  color: `var(--bs-${statusColor(t.status)})`,
                                  fontSize: '0.7rem',
                                  fontWeight: 500
                                }}
                              >
                                {new Date(t.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </Badge>
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {new Date(t.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Editable Section */}
            <FormProvider {...methods}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Card className="mb-4 shadow-sm border-0">
                  <Card.Header className="fw-semibold">Items</Card.Header>
                  <Card.Body>
                    <Table bordered responsive>
                      <thead className="table-light">
                        <tr>
                          <th>Image</th>
                          <th>Item</th>
                          <th>Variant</th>
                          <th>Add-Ons</th>
                          <th>Unit Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => (
                          <tr key={field.id}>
                            <td>
                              <img
                                src={watch(`items.${index}.itemPic`)}
                                alt=""
                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                              />
                            </td>
                            <td className="align-middle">{watch(`items.${index}.itemName`)}</td>
                            <td className="align-middle">{watch(`items.${index}.variantName`) || '-'}</td>
                            <td className="align-middle">
                              {watch(`items.${index}.selectedAddOns`)?.map((a, i) => (
                                <div key={i} className="small">
                                  {a.addOnName} x{a.quantity} ({order.currency} {a.addOnPrice})
                                </div>
                              )) || '-'}
                            </td>
                            <td className="align-middle">
                              {order.currency} {watch(`items.${index}.unitPrice`)}
                            </td>
                            <td style={{ width: 120 }}>
                              <NumberInput name={`items.${index}.quantity`} rules={requiredField('Quantity')} />
                            </td>
                            <td className="align-middle">
                              {order.currency} {watch(`items.${index}.totalPrice`)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>

                <Card className="mb-4 shadow-sm border-0">
                  <Card.Header className="fw-semibold">Instructions</Card.Header>
                  <Card.Body>
                    <TextArea name="instructions" label="Delivery Instructions" placeholder="Add instructions for the order..." rows={3} />
                  </Card.Body>
                </Card>

                <div className="text-end">
                  <Button variant="secondary" onClick={() => navigate('/order-management')}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="ms-2" disabled={loading}>
                    {isUpdating ? 'Updating...' : 'Update Order'}
                  </Button>
                </div>
              </Form>
            </FormProvider>

            {/* Drop Location */}
            {order.drop_location && (
              <Card className="mt-4 shadow-sm border-0">
                <Card.Header className="fw-semibold">Drop Location</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <InfoRow label="City" value={order.drop_location.city} />
                      <InfoRow label="State" value={order.drop_location.state} />
                    </Col>
                    <Col md={6}>
                      <InfoRow label="Address Line 1" value={order.drop_location.address_line1} />
                      <InfoRow label="Country" value={order.drop_location.country} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </div>
    </MainCard>
  );
};

export default OrderEditForm;
