import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFieldArray, FormProvider } from 'react-hook-form';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import TextInput from '../../../components/form/TextInput';
import SelectInput from '../../../components/form/SelectInput';
import TextArea from '../../../components/form/TextArea';
import PhoneInput from '../../../components/form/PhoneInput';
import TimeInput from '../../../components/form/TimeInput';
import { validationSchemas as V } from '../../../utils/validationSchema';
import { useRestaurantForm, weekDays } from './Container';
import { useGetCategoriesQuery } from '../../../store/api/categoryApi';
import TopTitleCard from '../../../components/cards/CustomCard';
import { useAddMerchantMutation, useGetMerchantByIdQuery, useUpdateMerchantMutation } from '../../../store/api/merchantApi';
import { FileUploadField } from '../../../components/form/FileUploadField';
import GooglePlaceInput from '../../../components/form/GooglePlaceInput';
import LocationPickerMap from '../../../components/form/LocationPickerMap';
import { autoFillAddressFields, reverseGeocodeAndFill, buildCompleteAddress, extractBaseGoogleAddress } from '../../../utils/addressParser';
import { skipToken } from '@reduxjs/toolkit/query/react';
import LoadingOverlay from 'components/LoadingOverlay';
import { parseGooglePlaceData } from '../../../utils/addressParser';

const RestaurantForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'pending';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const isEdit = !!id;

  const { data: merchantData, isLoading: isFetching } = useGetMerchantByIdQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true
  });

  const [addMerchant, { isLoading: isAdding }] = useAddMerchantMutation();
  const [updateMerchant, { isLoading: isUpdating }] = useUpdateMerchantMutation();

  const form = useRestaurantForm();
  const { handleSubmit, reset, navigate, watch, setValue, dispatch, setLoading } = form;
  const { data: categoryList } = useGetCategoriesQuery();
  const loading = isFetching || isAdding || isUpdating;

  const watchedPlotNo = watch('business.location.plot_no');
  const watchedFloor = watch('business.location.floor');
  const watchedBuildingName = watch('business.location.building_name');
  const watchedBaseAddress = watch('business.address');

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'business.hours'
  });
  const to24Hour = (time) => {
    if (!time) return '';
    const date = new Date(`1970-01-01 ${time}`);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (!isEdit && categoryList && categoryList.length > 0) {
      const restaurantCategory = categoryList.find((cat) => cat.name.toLowerCase() === 'restaurant');
      if (restaurantCategory) {
        setValue('categoryId', restaurantCategory._id);
      }
    }
  }, [categoryList, isEdit, setValue]);

  useEffect(() => {
    if (!merchantData?.data) return;

    const data = merchantData.data;
    const { ownerDetails = {}, merchant = {} } = data;
    const { ownerVerification = {}, business = {} } = merchant;

    const storedCompleteAddress = business?.location?.complete_address ?? '';
    const plotNo = business?.location?.plot_no ?? '';
    const floor = business?.location?.floor ?? '';
    const buildingName = business?.location?.building_name ?? '';

    const tempParsed = parseGooglePlaceData({
      formatted_address: storedCompleteAddress,
      address_components: [
        { long_name: plotNo, types: ['street_number'] },
        { long_name: floor, types: ['subpremise'] },
        { long_name: buildingName, types: ['premise'] }
      ]
    });

    reset({
      ownerName: ownerDetails.ownerName ?? '',
      email: ownerDetails.email ?? '',
      phone: ownerDetails.phone ?? '',
      categoryId: merchant.categoryId ?? '',
      isVerified: merchant.isVerified ?? false,
      status: merchant.status ?? 'pending',

      business: {
        address: tempParsed.base_address || storedCompleteAddress,
        businessName: business?.businessName ?? '',
        location: {
          coordinates: {
            latitude: business?.location?.coordinates?.latitude ?? '',
            longitude: business?.location?.coordinates?.longitude ?? ''
          },
          pincode: business?.location?.pincode ?? '',
          plot_no: plotNo,
          floor: floor,
          building_name: buildingName,
          complete_address: storedCompleteAddress
        },
        verification: {
          registrationNumber: business?.verification?.registrationNumber ?? '',
          taxIdentificationNumber: business?.verification?.taxIdentificationNumber ?? '',
          registrationCertificateUrl: business?.verification?.registrationCertificateUrl ?? '',
          businessDocumentUrl: business?.verification?.businessDocumentUrl ?? ''
        },
        branding: {
          storeLogo: business?.branding?.storeLogo ?? '',
          storePic: business?.branding?.storePic ?? ''
        }
      },

      ownerVerification: {
        idProofUrl: ownerVerification?.idProofUrl ?? '',
        selfieUrl: ownerVerification?.selfieUrl ?? ''
      }
    });

    replace(
      Array.isArray(business?.hours)
        ? business.hours.map((h) => ({
            day: h.day ?? '',
            open: to24Hour(h.open),
            close: to24Hour(h.close)
          }))
        : []
    );
  }, [merchantData, reset, replace]);

  useEffect(() => {
    if (!watchedBaseAddress) return;
    const rebuilt = buildCompleteAddress(watchedBaseAddress, watchedPlotNo, watchedFloor, watchedBuildingName);
    setValue('business.location.complete_address', rebuilt, { shouldDirty: true });
  }, [watchedPlotNo, watchedFloor, watchedBuildingName, watchedBaseAddress]);

  const onSubmit = async (formData) => {
    const formattedData = {
      isVerified: formData.isVerified,
      ownerName: formData.ownerName,
      email: formData.email,
      isProfileCompleted: true,
      categoryId: formData.categoryId,
      business: {
        address: formData.business?.location?.complete_address || '',
        businessName: formData.business?.businessName,
        location: {
          coordinates: {
            latitude: formData.business?.location?.coordinates?.latitude || '',
            longitude: formData.business?.location?.coordinates?.longitude || ''
          },
          pincode: formData.business?.location?.pincode,
          plot_no: formData.business?.location?.plot_no,
          floor: formData.business?.location?.floor,
          building_name: formData.business?.location?.building_name,
          complete_address: formData.business?.location?.complete_address
        },
        verification: {
          registrationNumber: formData.business?.verification?.registrationNumber,
          taxIdentificationNumber: formData.business?.verification?.taxIdentificationNumber,
          registrationCertificateUrl: formData.business?.verification?.registrationCertificateUrl,
          businessDocumentUrl: formData.business?.verification?.businessDocumentUrl,
          representativeVerificationUrl: formData.business?.verification?.representativeVerificationUrl
        },
        hours: Array.isArray(formData.business?.hours) ? formData.business.hours : [],
        branding: {
          storeLogo: formData.business?.branding?.storeLogo,
          storePic: formData.business?.branding?.storePic
        }
      },
      phone: formData.phone,
      ownerVerification: {
        idProofUrl: formData.ownerVerification?.idProofUrl,
        selfieUrl: formData.ownerVerification?.selfieUrl
      }
    };

    try {
      if (isEdit) {
        await updateMerchant({ id, payload: formattedData }).unwrap();
        navigate(`/merchant-management/restaurants?tab=${tabFromUrl}&page=${page}&rows=${rows}`);
      } else {
        await addMerchant(formattedData).unwrap();
        reset();
        navigate(`/merchant-management/restaurants?tab=${tabFromUrl}&page=${page}&rows=${rows}`);
      }
    } catch (error) {
      console.error('Failed to save restaurant:', error);
    }
  };

  const breadcrumbs = [
    { label: 'Restaurants', url: '/merchant-management/restaurants' },
    {
      label: isEdit ? 'Edit Restaurant' : 'Add Restaurant',
      url: isEdit ? `/merchant-management/restaurants/edit/${id}` : '/merchant-management/restaurants/add'
    }
  ];

  return (
    <MainCard>
      <div className="mb-4">
        <TopTitleCard title="Restaurants" breadcrumbs={breadcrumbs} />
      </div>
      <div className="position-relative">
        {loading && <LoadingOverlay />}
        <FormProvider {...form}>
          <Form onSubmit={handleSubmit(onSubmit)} className={loading ? 'opacity-50 pe-none' : ''}>
            {/* ================= OWNER DETAILS ================= */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="fw-bold">Owner Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <TextInput name="ownerName" label="Owner Name" placeholder="Enter owner name" required rules={V.ownerName} />
                  </Col>

                  <Col md={6}>
                    <TextInput
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Enter email"
                      required
                      rules={V.email}
                      disabled={isEdit}
                    />
                  </Col>

                  <Col md={6}>
                    <PhoneInput
                      name="phone"
                      label="Phone Number"
                      required
                      disabled={isEdit}
                      rules={{
                        required: 'Phone number is required',
                        validate: (value) => (value && value.length >= 10) || 'Invalid phone number'
                      }}
                    />
                  </Col>

                  <Col md={6}>
                    <SelectInput
                      name="categoryId"
                      label="Category"
                      required
                      disabled
                      placeholder="Select Category"
                      options={categoryList?.map((category) => ({
                        value: category._id,
                        label: category.name
                      }))}
                      rules={{
                        required: 'Category is required'
                      }}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {/* ================= BUSINESS DETAILS ================= */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="fw-bold">Business Details</Card.Header>
              <Card.Body>
                {/* Google Places Autocomplete + Map */}
                <Row>
                  <Col md={12}>
                    <GooglePlaceInput
                      name="business.address"
                      label="Search Address"
                      placeholder="Search for business address"
                      rules={{ required: 'Address is required' }}
                      onPlaceSelect={(data) => {
                        autoFillAddressFields(data, setValue);
                      }}
                    />
                  </Col>
                  <Col md={12}>
                    <LocationPickerMap
                      latitude={watch('business.location.coordinates.latitude')}
                      longitude={watch('business.location.coordinates.longitude')}
                      onLocationChange={(lat, lng) => {
                        reverseGeocodeAndFill(lat, lng, setValue);
                      }}
                      disabled={loading}
                    />
                  </Col>
                </Row>

                {/* Basic Info */}
                <Row>
                  <Col md={6}>
                    <TextInput
                      name="business.businessName"
                      required
                      label="Business Name"
                      placeholder="Enter business name"
                      rules={V.businessName}
                    />
                  </Col>

                  <Col md={6}>
                    <TextInput name="business.location.pincode" required label="Pincode" placeholder="Enter pincode" rules={V.pincode} />
                  </Col>
                </Row>

                {/* Extended Location */}
                <Row>
                  <Col md={4}>
                    <TextInput
                      name="business.location.plot_no"
                      // required
                      label="Plot No."
                      placeholder="Enter plot number"
                      // rules={V.plotNo}
                    />
                  </Col>
                  <Col md={4}>
                    <TextInput name="business.location.floor" required label="Floor" placeholder="Enter floor" rules={V.floor} />
                  </Col>

                  <Col md={4}>
                    <TextInput
                      name="business.location.building_name"
                      required
                      label="Building Name"
                      placeholder="Enter building name"
                      rules={V.buildingName}
                    />
                  </Col>
                </Row>

                {/* Address (auto-filled from Google Places - read only) */}
                <Row>
                  <Col md={12}>
                    <TextArea
                      name="business.location.complete_address"
                      label="Complete Address"
                      rows={2}
                      placeholder="Auto-filled from search above"
                      readOnly
                      disabled
                    />
                  </Col>
                </Row>

                {/* Dynamic Working Schedule */}
                <Card className="mb-3">
                  <Card.Header className="fw-bold d-flex justify-content-between align-items-center">Working Hours</Card.Header>
                  <Card.Body>
                    {fields.map((item, index) => (
                      <Row key={item.id} className="align-items-center mb-3">
                        {/* Day */}
                        <Col md={3}>
                          <SelectInput
                            name={`business.hours.${index}.day`}
                            label="Day"
                            required
                            options={weekDays.map((day) => ({
                              label: day.label,
                              value: day.value
                            }))}
                            rules={{
                              validate: (value) => {
                                if (!value) return 'Day is required';

                                const hours = watch('business.hours');
                                if (!Array.isArray(hours)) return true;

                                const duplicates = hours.filter((h) => h.day === value);
                                if (duplicates.length > 1) {
                                  return 'This day is already added!';
                                }

                                return true;
                              }
                            }}
                          />
                        </Col>

                        {/* Opening Hours */}
                        <Col md={3}>
                          <TimeInput
                            name={`business.hours.${index}.open`}
                            label="Opening Hours"
                            required
                            rules={{ required: 'Opening time required' }}
                          />
                        </Col>

                        {/* Closing Hours */}
                        <Col md={3}>
                          <TimeInput
                            name={`business.hours.${index}.close`}
                            label="Closing Hours"
                            required
                            rules={{ required: 'Closing time required' }}
                          />
                        </Col>

                        {/* Remove Button */}
                        <Col md={2}>
                          <Button variant="outline-danger" onClick={() => remove(index)} className="mt-3">
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    {fields.length === 0 && <div className="text-muted text-center">No working days added yet.</div>}

                    {/* Add button aligned right */}
                    <div className="mt-3 text-end">
                      <Button
                        variant="outline-primary"
                        onClick={() =>
                          append({
                            day: '', // monday
                            open: '',
                            close: ''
                          })
                        }
                      >
                        + Add Day
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {/* Verification */}
                <Row className="mt-3">
                  <Col md={6}>
                    <TextInput
                      name="business.verification.registrationNumber"
                      required
                      label="Registration Number"
                      placeholder="Enter registration number"
                      rules={V.registrationNumber}
                    />
                  </Col>
                  <Col md={6}>
                    <TextInput
                      name="business.verification.taxIdentificationNumber"
                      label="Tax Identification Number (TIN)"
                      required
                      placeholder="Enter TIN"
                      rules={V.taxIdentification}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FileUploadField
                      label="Registration Certificate"
                      fieldName="business.verification.registrationCertificateUrl"
                      required={true}
                      dispatch={dispatch}
                      setLoading={setLoading}
                    />
                  </Col>

                  <Col md={6}>
                    <FileUploadField
                      label="Business Document"
                      fieldName="business.verification.businessDocumentUrl"
                      required={true}
                      dispatch={dispatch}
                      setLoading={setLoading}
                    />
                  </Col>
                </Row>

                {/* Branding */}
                <Row className="mt-3">
                  <Col md={6}>
                    <FileUploadField
                      label="Store Logo"
                      fieldName="business.branding.storeLogo"
                      dispatch={dispatch}
                      setLoading={setLoading}
                      onlyImage
                      aspectRatio={1}
                      sizeHint="Recommended: 200 x 200px"
                    />
                  </Col>

                  <Col md={6}>
                    <FileUploadField
                      label="Store Picture"
                      fieldName="business.branding.storePic"
                      dispatch={dispatch}
                      setLoading={setLoading}
                      onlyImage
                      aspectRatio={300 / 250}
                      sizeHint="Recommended: 300 x 250px"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= OWNER VERIFICATION ================= */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="fw-bold">Owner Verification</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <FileUploadField
                      label="ID Proof"
                      fieldName="ownerVerification.idProofUrl"
                      dispatch={dispatch}
                      setLoading={setLoading}
                    />
                  </Col>
                  <Col md={6}>
                    <FileUploadField
                      label="Selfie"
                      fieldName="ownerVerification.selfieUrl"
                      dispatch={dispatch}
                      setLoading={setLoading}
                      onlyImage
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ================= SUBMIT BUTTON ================= */}
            <div className="text-center">
              <Button type="submit" className="px-5" variant={isEdit ? 'warning' : 'primary'} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {isEdit ? 'Updating...' : 'Saving...'}
                  </>
                ) : isEdit ? (
                  'Update Restaurant'
                ) : (
                  'Add Restaurant'
                )}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </div>
    </MainCard>
  );
};

export default RestaurantForm;
