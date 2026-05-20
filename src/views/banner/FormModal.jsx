import React, { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import { FileUploadField } from '../../components/form/FileUploadField';
import BaseModal from '../../components/modals/BaseModal';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';

const BannerFormModal = ({
  modal,
  form,
  dispatch,
  merchantOptions,
  categoryOptions,
  selectedCategoryId,
  categoriesLoading,
  merchantsLoading
}) => {
  const { show, setShow, isEditing, onSubmit } = modal;
  const { loading, handleSubmit, setUploadLoading, watch, setValue } = form;

  const now = () => {
    const d = new Date();
    d.setSeconds(0, 0);
    return d;
  };

  const toLocalDatetimeString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d}T${h}:${min}`;
  };

  const minDatetime = toLocalDatetimeString(now());

  const startsOnValue = watch('startsOn');
  const expiresOnValue = watch('expiresOn');

  useEffect(() => {
    if (!startsOnValue) return;
    const minDt = toLocalDatetimeString(now());
    if (startsOnValue < minDt) {
      setValue('startsOn', minDt);
    }
  }, [startsOnValue, setValue]);

  useEffect(() => {
    if (!expiresOnValue) return;
    const minDt = startsOnValue || toLocalDatetimeString(now());
    if (expiresOnValue < minDt) {
      setValue('expiresOn', minDt);
    }
  }, [expiresOnValue, startsOnValue, setValue]);

  const footer = (
    <>
      <Button variant="secondary" onClick={() => setShow(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="banner-form" disabled={loading}>
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <BaseModal show={show} onHide={() => setShow(false)} title={isEditing ? 'Edit Banner' : 'Add New Banner'} size="lg" footer={footer}>
      <FormProvider {...form}>
        <Form id="banner-form" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="title"
            label="Banner Title"
            placeholder="Enter banner title"
            rules={{
              required: 'Banner title is required',
              minLength: { value: 2, message: 'Banner title must be at least 2 characters' },
              maxLength: { value: 50, message: 'Banner title must be at most 50 characters' }
            }}
          />

          <SelectInput
            name="categoryId"
            label="Category"
            placeholder="Select Category"
            options={categoryOptions}
            rules={{ required: 'Category is required' }}
            loading={categoriesLoading}
          />

          <SelectInput
            name="merchantId"
            label="Merchant"
            placeholder={selectedCategoryId ? 'Select Merchant' : 'Select a category first'}
            options={merchantOptions}
            rules={{ required: 'Merchant is required' }}
            disabled={!selectedCategoryId}
            loading={merchantsLoading}
          />

          <TextInput
            name="startsOn"
            label="Starts On"
            type="datetime-local"
            min={minDatetime}
            rules={{
              required: 'Start date is required',
              validate: (value) => {
                if (new Date(value) < now()) return 'Start date cannot be in the past';
                return true;
              }
            }}
          />

          <TextInput
            name="expiresOn"
            label="Expires On"
            type="datetime-local"
            min={watch('startsOn') || minDatetime}
            rules={{
              required: 'Expiry date is required',
              validate: (value) => {
                if (new Date(value) < now()) return 'End date cannot be in the past';
                const startsOn = watch('startsOn');
                if (startsOn && new Date(value) < new Date(startsOn)) return 'End date must be same as or after start date';
                return true;
              }
            }}
          />

          <FileUploadField
            label="Banner Image"
            fieldName="image"
            dispatch={dispatch}
            setLoading={setUploadLoading}
            required={true}
            onlyImage={true}
            aspectRatio={331 / 161}
            sizeHint="Recommended: 331 x 161px"
          />
        </Form>
      </FormProvider>
    </BaseModal>
  );
};

export default BannerFormModal;
