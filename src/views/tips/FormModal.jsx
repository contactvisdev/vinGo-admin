import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';

const TipFormModal = ({ modal, form }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit } = form;

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="tip-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal show={show} onHide={() => setShow(false)} title={isEditing ? 'Edit Tip' : 'Add New Tip'} size="lg" footer={footer}>
      <FormProvider {...form}>
        <Form id="tip-form" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="tip_percentage"
            label="Tip Percentage"
            placeholder="Enter tip percentage (1-100)"
            type="number"
            rules={{
              required: 'Tip percentage is required',
              min: { value: 1, message: 'Minimum value is 1' },
              max: { value: 100, message: 'Maximum value is 100' },
              validate: (value) => {
                if (!/^\d+$/.test(value)) {
                  return 'Only numeric values allowed';
                }
                return true;
              }
            }}
          />
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default TipFormModal;
