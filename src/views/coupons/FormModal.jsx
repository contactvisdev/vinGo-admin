import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';
import TextArea from '../../components/form/TextArea';
import SelectInput from '../../components/form/SelectInput';

const CouponFormModal = ({ modal, form }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit } = form;
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const preventNegativeInput = (event) => {
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  };

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="coupon-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal show={show} onHide={() => setShow(false)} title={isEditing ? 'Edit Coupon' : 'Add New Coupon'} size="lg" footer={footer}>
      <FormProvider {...form}>
        <Form id="coupon-form" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <TextInput
                name="title"
                label="Code"
                placeholder="e.g., NEWYEAR50"
                rules={{
                  required: 'Coupon code is required',
                  minLength: { value: 5, message: 'Coupon code must be at least 5 characters' },
                  maxLength: { value: 10, message: 'Coupon code cannot exceed 10 characters' },
                  validate: (value) => value === (value || '').toUpperCase() || 'Coupon code must be in uppercase'
                }}
              />
            </Col>
            <Col md={6}>
              <SelectInput
                name="status"
                label="Status"
                placeholder="Select status"
                rules={{ required: 'Status is required' }}
                options={statusOptions}
              />
            </Col>
          </Row>

          <TextArea
            name="description"
            label="Description"
            placeholder="Enter coupon description"
            rules={{ required: 'Description is required' }}
            rows={3}
          />

          <Row>
            <Col md={6}>
              <TextInput
                name="discountPercentage"
                label="Discount Percentage"
                type="number"
                placeholder="e.g., 50"
                min={0}
                onKeyDown={preventNegativeInput}
                rules={{
                  required: 'Discount percentage is required',
                  min: { value: 0, message: 'Discount percentage cannot be negative' },
                  max: { value: 100, message: 'Cannot be greater than 100' }
                }}
              />
            </Col>
            <Col md={6}>
              <TextInput
                name="minimumAmount"
                label="Minimum Amount"
                type="number"
                placeholder="e.g., 1000"
                min={0}
                onKeyDown={preventNegativeInput}
                rules={{
                  required: 'Minimum amount is required',
                  min: { value: 0, message: 'Minimum amount cannot be negative' }
                }}
              />
            </Col>
          </Row>
          <TextInput
            name="startsOn"
            label="Starts On"
            type="date"
            min={todayDate}
            rules={{
              required: 'Start date is required',
              validate: (value) => {
                if (!value) return 'Expiry date is required';
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today || 'Expiry date cannot be before today';
              }
            }}
          />
          <TextInput
            name="expiresOn"
            label="Expires On"
            type="date"
            min={todayDate}
            rules={{
              required: 'Expiry date is required',
              validate: (value) => {
                if (!value) return 'Expiry date is required';
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today || 'Expiry date cannot be before today';
              }
            }}
          />
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default CouponFormModal;
