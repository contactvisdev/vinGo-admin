import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import RichTextInput from '../../components/form/RichTextInput';

const typeOptions = [
  { value: 'terms_conditions', label: 'Terms & Conditions' },
  { value: 'privacy_policy', label: 'Privacy Policy' }
];

const userTypeOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'driver', label: 'Driver' }
];

const TermsPolicyFormModal = ({ modal, form }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit } = form;

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="terms-policy-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      onHide={() => setShow(false)}
      title={isEditing ? 'Edit Terms/Policy' : 'Add New Terms/Policy'}
      size="lg"
      footer={footer}
      bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      <FormProvider {...form}>
        <Form id="terms-policy-form" onSubmit={handleSubmit(onSubmit)}>
          {/* <TextInput
            name="title"
            label="Title"
            placeholder="Enter title"
            rules={{
              required: 'Title is required',
              minLength: { value: 2, message: 'Minimum length is 2 characters' },
              maxLength: { value: 20, message: 'Maximum length is 20 characters' }
            }}
          /> */}
          <SelectInput name="type" label="Type" placeholder="Select type" options={typeOptions} rules={{ required: 'Type is required' }} />
          <SelectInput
            name="userType"
            label="User Type"
            placeholder="Select user type"
            options={userTypeOptions}
            rules={{ required: 'User type is required' }}
          />
          <RichTextInput
            name="content"
            label="Content"
            placeholder="Enter content"
            rules={{
              required: 'Content is required',
              minLength: { value: 20, message: 'Content must be at least 20 characters long' }
            }}
          />
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default TermsPolicyFormModal;
