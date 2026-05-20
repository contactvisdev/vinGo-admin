import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import { FileUploadField } from '../../components/form/FileUploadField';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';
import NumberInput from '../../components/form/NumberInput';

const CategoryFormModal = ({ modal, form, dispatch }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit, setUploadLoading, errors } = form;

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="category-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal show={show} onHide={() => setShow(false)} title={isEditing ? 'Edit Category' : 'Add New Category'} size="lg" footer={footer}>
      <FormProvider {...form}>
        <Form id="category-form" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="name"
            label="Category Name"
            placeholder="Enter category name (e.g., Restaurant, Grocery)"
            rules={{
              required: 'Category name is required',
              maxLength: {
                value: 25,
                message: 'Maximum length is 25 characters'
              }
            }}
          />

          {/* <NumberInput
            name="sort"
            label="Sort Order"
            placeholder="Enter sort order"
            rules={{ required: 'Sort order is required' }}
          /> */}

          <FileUploadField
            label="Image"
            fieldName="image"
            dispatch={dispatch}
            setLoading={setUploadLoading}
            errors={errors}
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

export default CategoryFormModal;
