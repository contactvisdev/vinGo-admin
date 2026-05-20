import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';

const StoreTypeFormModal = ({ modal, form }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit, categoryOptions, categoriesLoading } = form;

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="store-type-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      onHide={() => setShow(false)}
      title={isEditing ? 'Edit Store Type' : 'Add New Store Type'}
      size="lg"
      footer={footer}
    >
      <FormProvider {...form}>
        <Form id="store-type-form" onSubmit={handleSubmit(onSubmit)}>
          <SelectInput
            name="categoryId"
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            loading={categoriesLoading}
            rules={{ required: 'Category is required' }}
          />
          <TextInput
            name="storeType"
            label="Store Type Name"
            placeholder="Enter store type name (e.g., Convenience)"
            rules={{
              required: 'Store type name is required',
              minLength: {
                value: 2,
                message: 'Minimum length is 2 characters'
              },
              maxLength: {
                value: 30,
                message: 'Maximum length is 30 characters'
              }
            }}
          />
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default StoreTypeFormModal;
