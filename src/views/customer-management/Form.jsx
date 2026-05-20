import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import TopTitleCard from '../../components/cards/CustomCard';
import { requiredField, emailSchema, dobSchema } from '../../utils/validationSchema';
import { COUNTRY_OPTIONS as RAW_COUNTRY_OPTIONS } from '../../utils/country';

const COUNTRY_OPTIONS = RAW_COUNTRY_OPTIONS.map((c) => ({ label: c.name, value: c.value }));
import { useAddCustomerMutation, useGetCustomerByIdQuery, useUpdateCustomerMutation } from '../../store/api/customerApi';
import TextInput from 'components/form/TextInput';
import SelectInput from 'components/form/SelectInput';
import PhoneInput from 'components/form/PhoneInput';
import { FileUploadField } from '../../components/form/FileUploadField';
import LoadingOverlay from 'components/LoadingOverlay';
import { useCustomerForm } from './Container';

const LOCALE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'it-IT', label: 'Italian (Italy)' },
  { value: 'pt-PT', label: 'Portuguese (Portugal)' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'zh-TW', label: 'Chinese (Traditional)' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
  { value: 'ru-RU', label: 'Russian' },
  { value: 'hi-IN', label: 'Hindi (India)' }
];

const CustomerForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'pending';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const isEdit = !!id;
  const dispatch = useDispatch();

  const form = useCustomerForm();
  const { handleSubmit, reset, navigate, setValue, setLoading } = form;

  // ================== RTK Query Hooks ==================
  const { data: customerData, isLoading: isFetching } = useGetCustomerByIdQuery(id, { skip: !isEdit });
  const [addCustomer, { isLoading: isAdding }] = useAddCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const loading = isFetching || isAdding || isUpdating;

  // ================== FETCH EXISTING DATA IF EDIT ==================
  useEffect(() => {
    if (customerData?.data?.user) {
      const { user } = customerData.data;
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        status: user.status || 'active',
        country: user.country || '',
        baseCurrency: user.baseCurrency || '',
        gender: user.gender || '',
        idNumber: user.idNumber || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        profilePic: user.profilePic || '',
        locale: user.locale || 'en-US'
      });
      setValue('profilePic', user.profilePic || '');
    }
  }, [customerData, reset, setValue]);

  // ================== HANDLE SUBMIT ==================
  const onSubmit = async (formData) => {
    const payload = {
      ...formData
    };

    try {
      if (isEdit) {
        await updateCustomer({ id, payload }).unwrap();
        navigate(`/customer-management?tab=${tabFromUrl}&page=${page}&rows=${rows}`);
      } else {
        await addCustomer(payload).unwrap();
        reset();
        navigate(`/customer-management?tab=${tabFromUrl}&page=${page}&rows=${rows}`);
      }
    } catch (err) {
      console.error('Failed to save customer:', err);
    }
  };

  const breadcrumbs = [
    { label: 'Customer Management', url: '/customer-management' },
    { label: isEdit ? 'Edit Customer' : 'Add Customer', url: isEdit ? `/customer-management/edit/${id}` : '/customer-management/add' }
  ];

  return (
    <MainCard>
      <div className="mb-4">
        <TopTitleCard title="Customer Management" breadcrumbs={breadcrumbs} />
      </div>

      <div className="position-relative">
        {loading && <LoadingOverlay />}

        <FormProvider {...form}>
          <Form onSubmit={handleSubmit(onSubmit)} className={loading ? 'opacity-50 pe-none' : ''}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="fw-bold">{isEdit ? 'Edit Customer' : 'Add Customer'}</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <TextInput name="firstName" label="First Name" placeholder="Enter first name" rules={requiredField('First Name')} />
                  </Col>

                  <Col md={6}>
                    <TextInput name="lastName" label="Last Name" placeholder="Enter last name" rules={requiredField('Last Name')} />
                  </Col>

                  <Col md={6}>
                    <TextInput name="email" label="Email" type="email" placeholder="Enter email" rules={emailSchema} />
                  </Col>

                  <Col md={6}>
                    <PhoneInput name="phone" label="Phone" disabled={isEdit} />
                  </Col>

                  <Col md={6}>
                    <SelectInput
                      name="status"
                      label="Status"
                      placeholder="Select Status"
                      rules={requiredField('Status')}
                      options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' }
                      ]}
                    />
                  </Col>

                  <Col md={6}>
                    <SelectInput
                      name="gender"
                      label="Gender"
                      placeholder="Select Gender"
                      rules={requiredField('Gender')}
                      options={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                        { label: 'Other', value: 'Other' }
                      ]}
                    />
                  </Col>

                  <Col md={6}>
                    <SelectInput
                      name="locale"
                      label="Locale"
                      placeholder="Select Locale"
                      rules={requiredField('Locale')}
                      options={LOCALE_OPTIONS}
                    />
                  </Col>

                  <Col md={6}>
                    <TextInput name="dob" label="Date of Birth" type="date" rules={dobSchema} />
                  </Col>

                  <Col md={6}>
                    <TextInput name="idNumber" label="ID Number" placeholder="Enter ID number" rules={requiredField('ID Number')} />
                  </Col>

                  <Col md={6}>
                    <SelectInput
                      name="country"
                      label="Country"
                      placeholder="Select Country"
                      rules={requiredField('Country')}
                      options={COUNTRY_OPTIONS}
                    />
                  </Col>

                  <Col md={6}>
                    <TextInput
                      name="baseCurrency"
                      label="Base Currency"
                      placeholder="Enter currency"
                      rules={requiredField('Base Currency')}
                    />
                  </Col>

                  <Col md={6}>
                    <FileUploadField
                      label="Profile Picture"
                      fieldName="profilePic"
                      dispatch={dispatch}
                      onlyImage
                      setLoading={setLoading}
                      aspectRatio={1}
                      sizeHint="Recommended: 1:1 (e.g. 500 x 500px)"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={() => navigate('/customer-management')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {isEdit ? 'Update Customer' : 'Add Customer'}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </div>
    </MainCard>
  );
};

export default CustomerForm;
