import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import { FileUploadField } from '../../components/form/FileUploadField';

const ProductTypeFormModal = ({ modal, form }) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit, categoryOptions, categoriesLoading, watch } = form;

  const selectedCategoryId = watch?.('categoryId');
  const selectedCategoryName = categoryOptions?.find((c) => c.value === selectedCategoryId)?.label?.toLowerCase();
  const isGrocery = selectedCategoryName === 'grocery';

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="product-type-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      onHide={() => setShow(false)}
      title={isEditing ? 'Edit Product Type' : 'Add New Product Type'}
      size="lg"
      footer={footer}
    >
      <FormProvider {...form}>
        <Form id="product-type-form" onSubmit={handleSubmit(onSubmit)}>
          <SelectInput
            name="categoryId"
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            loading={categoriesLoading}
            rules={{ required: 'Category is required' }}
          />

          <TextInput
            name="name"
            label="Product Type Name"
            placeholder="Enter product type name (e.g., Fresh Produce)"
            rules={{
              required: 'Product Type name is required',
              minLength: { value: 2, message: 'Product Type name must be at least 2 characters' },
              maxLength: { value: 20, message: 'Product Type name must be at most 20 characters' }
            }}
          />

          {!isGrocery && selectedCategoryName && (
            <FileUploadField
              fieldName="productTypeImg"
              label="Product Type Image"
              onlyImage={true}
              aspectRatio={1}
              sizeHint="Recommended aspect ratio 500x500 (1:1)"
            />
          )}
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default ProductTypeFormModal;
