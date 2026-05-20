import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import { FileUploadField } from '../../components/form/FileUploadField';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';

const FoodTypeFormModal = ({ modal, form, dispatch }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit, setUploadLoading } = form;

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="food-type-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      onHide={() => setShow(false)}
      title={isEditing ? 'Edit Food Type' : 'Add New Food Type'}
      size="lg"
      footer={footer}
    >
      <FormProvider {...form}>
        <Form id="food-type-form" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="foodType"
            label="Food Type Name"
            placeholder="Enter food type name (e.g., Pizza, Burger)"
            rules={{
              required: 'Food Type name is required',
              minLength: { value: 2, message: 'Food Type name must be at least 2 characters' },
              maxLength: { value: 20, message: 'Food Type name must be at most 20 characters' }
            }}
          />

          <FileUploadField
            label="Image"
            fieldName="image"
            dispatch={dispatch}
            setLoading={setUploadLoading}
            required={true}
            onlyImage={true}
            aspectRatio={1}
            sizeHint="Recommended: 500 x 500px"
          />
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default FoodTypeFormModal;
