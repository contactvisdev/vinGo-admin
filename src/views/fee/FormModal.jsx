import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import { requiredField } from '../../utils/validationSchema';

const FeeFormModal = ({ modal, form, dispatch }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit } = form;

  const options = [
    { label: 'USD – US Dollar', value: 'USD' },
    { label: 'EUR – Euro', value: 'EUR' },
    { label: 'GBP – British Pound', value: 'GBP' },
    { label: 'INR – Indian Rupee', value: 'INR' },
    { label: 'CAD – Canadian Dollar', value: 'CAD' },
    { label: 'AUD – Australian Dollar', value: 'AUD' },
    { label: 'NZD – New Zealand Dollar', value: 'NZD' },
    { label: 'CHF – Swiss Franc', value: 'CHF' },
    { label: 'JPY – Japanese Yen', value: 'JPY' },
    { label: 'CNY – Chinese Yuan', value: 'CNY' },
    { label: 'SGD – Singapore Dollar', value: 'SGD' },
    { label: 'HKD – Hong Kong Dollar', value: 'HKD' },
    { label: 'AED – UAE Dirham', value: 'AED' },
    { label: 'SAR – Saudi Riyal', value: 'SAR' },
    { label: 'ZAR – South African Rand', value: 'ZAR' },
    { label: 'SEK – Swedish Krona', value: 'SEK' },
    { label: 'NOK – Norwegian Krone', value: 'NOK' },
    { label: 'DKK – Danish Krone', value: 'DKK' },
    { label: 'THB – Thai Baht', value: 'THB' },
    { label: 'MYR – Malaysian Ringgit', value: 'MYR' },
    { label: 'IDR – Indonesian Rupiah', value: 'IDR' },
    { label: 'PHP – Philippine Peso', value: 'PHP' },
    { label: 'KRW – South Korean Won', value: 'KRW' },
    { label: 'BRL – Brazilian Real', value: 'BRL' },
    { label: 'MXN – Mexican Peso', value: 'MXN' },
    { label: 'AWG – Aruban Florin', value: 'AWG' }
  ];

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="fee-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal show={show} onHide={() => setShow(false)} title={isEditing ? 'Edit Fee' : 'Add New Fee'} size="lg" footer={footer}>
      <FormProvider {...form}>
        <Form id="fee-form" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <TextInput
                name="distanceRange"
                label="Distance Range"
                placeholder="e.g., 0-5 km"
                rules={{
                  ...requiredField('Distance Range'),
                  pattern: { value: /^[a-zA-Z0-9\s\-.,km]+$/, message: 'Enter a valid distance range (e.g., 0-5 km)' },
                  maxLength: { value: 30, message: 'Distance range must be at most 30 characters' }
                }}
              />
            </Col>
            <Col md={6}>
              <SelectInput
                name="currency"
                label="Currency"
                placeholder="Select Currency"
                rules={requiredField('Currency')}
                options={options}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <TextInput
                name="deliveryFee"
                label="Delivery Fee"
                type="number"
                placeholder="0"
                rules={{
                  required: 'Delivery Fee is required',
                  validate: (value) => {
                    if (value === '' || value === null || value === undefined) return 'Delivery Fee is required';
                    if (isNaN(Number(value))) return 'Enter a valid number';
                    if (Number(value) < 0) return 'Must be non-negative';
                    return true;
                  }
                }}
              />
            </Col>
            <Col md={6}>
              <TextInput
                name="serviceFee"
                label="Service Fee"
                type="number"
                placeholder="0"
                rules={{
                  required: 'Service Fee is required',
                  validate: (value) => {
                    if (value === '' || value === null || value === undefined) return 'Service Fee is required';
                    if (isNaN(Number(value))) return 'Enter a valid number';
                    if (Number(value) < 0) return 'Must be non-negative';
                    return true;
                  }
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <TextInput
                name="tax"
                label="Tax"
                type="number"
                placeholder="0"
                rules={{
                  required: 'Tax is required',
                  validate: (value) => {
                    if (value === '' || value === null || value === undefined) return 'Tax is required';
                    if (isNaN(Number(value))) return 'Enter a valid number';
                    if (Number(value) < 0) return 'Must be non-negative';
                    return true;
                  }
                }}
              />
            </Col>
            {/* <Col md={6}>
              <TextInput
                name="tip"
                label="Tip"
                type="number"
                placeholder="0"
                rules={{ required: 'Tip is required', min: { value: 0, message: 'Must be non-negative' } }}
              />
            </Col> */}
          </Row>
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default FeeFormModal;
