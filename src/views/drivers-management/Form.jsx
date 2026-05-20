import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import TopTitleCard from '../../components/cards/CustomCard';
import { useAddDriverMutation, useGetDriverByIdQuery, useUpdateDriverMutation } from '../../store/api/driverApi';
import { requiredField, emailSchema } from '../../utils/validationSchema';
import { useDriverForm } from './Container';
import { FileUploadField } from '../../components/form/FileUploadField';
import TextInput from 'components/form/TextInput';
import NumberInput from 'components/form/NumberInput';
import LoadingOverlay from 'components/LoadingOverlay';

const Section = ({ title, children }) => (
  <div className="mb-4">
    <h6 className="fw-semibold text-secondary mb-3 border-bottom pb-2">{title}</h6>
    {children}
  </div>
);

const DriverForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'pending';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const isEdit = !!id;
  const navigate = useNavigate();

  const [addDriver, { isLoading: isAdding }] = useAddDriverMutation();
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();
  const { data: driverRes, isLoading: isFetching } = useGetDriverByIdQuery(id, { skip: !isEdit });

  const form = useDriverForm();
  const { handleSubmit, reset, setValue, dispatch } = form;

  const loading = isAdding || isUpdating || isFetching;

  useEffect(() => {
    if (isEdit && driverRes) {
      const user = driverRes?.data?.user;
      if (!user) return;

      reset({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        address_line1: user.address_line1 ?? '',
        address_line2: user.address_line2 ?? '',
        city: user.city ?? '',
        state: user.state ?? '',
        country: user.country ?? '',
        documents: user.documents ?? {}
      });

      setValue('profilePic', user.profilePic);
    }
  }, [isEdit, driverRes, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateDriver({ id, payload: data }).unwrap();
      } else {
        await addDriver(data).unwrap();
      }
      navigate(`/driver-management?tab=${tabFromUrl}&page=${page}&rows=${rows}`);
    } catch (err) {
      console.error('Failed to save driver:', err);
    }
  };

  return (
    <MainCard>
      <TopTitleCard
        title="Driver Management"
        breadcrumbs={[{ label: 'Driver Management', url: '/driver-management' }, { label: isEdit ? 'Edit Driver' : 'Add Driver' }]}
      />

      <div className="position-relative">
        {loading && <LoadingOverlay />}
        <FormProvider {...form}>
          <Form onSubmit={handleSubmit(onSubmit)} className={loading ? 'opacity-50 pe-none' : ''}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <Section title="Basic Information">
                  <Row>
                    <Col md={6}>
                      <TextInput name="firstName" label="First Name" rules={requiredField('First Name')} />
                    </Col>
                    <Col md={6}>
                      <TextInput name="lastName" label="Last Name" rules={requiredField('Last Name')} />
                    </Col>
                    <Col md={6}>
                      <TextInput name="email" label="Email" rules={emailSchema} />
                    </Col>
                  </Row>
                </Section>

                <Section title="Address Details">
                  <Row>
                    <Col md={6}>
                      <TextInput name="address_line1" label="Address Line 1" rules={requiredField('Address Line 1')} />
                    </Col>
                    <Col md={6}>
                      <TextInput name="address_line2" label="Address Line 2" rules={requiredField('Address Line 2')} />
                    </Col>
                    <Col md={4}>
                      <TextInput name="city" label="City" rules={requiredField('City')} />
                    </Col>
                    <Col md={4}>
                      <TextInput name="state" label="State" rules={requiredField('State')} />
                    </Col>
                    <Col md={4}>
                      <TextInput name="country" label="Country" rules={requiredField('Country')} />
                    </Col>
                  </Row>
                </Section>

                <Section title="Profile & Identity">
                  <Row className="mb-3">
                    <Col md={6}>
                      <FileUploadField
                        label="Profile Picture"
                        fieldName="profilePic"
                        dispatch={dispatch}
                        required
                        onlyImage
                        aspectRatio={1}
                        sizeHint="Recommended: 1:1 (e.g. 500 x 500px)"
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <FileUploadField
                        label="ID Verification - Front"
                        fieldName="documents.idVerification.front"
                        dispatch={dispatch}
                        required
                      />
                    </Col>

                    <Col md={6}>
                      <FileUploadField
                        label="ID Verification - Back"
                        fieldName="documents.idVerification.back"
                        dispatch={dispatch}
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FileUploadField
                        label="Driving License - Front"
                        fieldName="documents.drivingLicense.front"
                        dispatch={dispatch}
                        required
                      />
                    </Col>

                    <Col md={6}>
                      <FileUploadField
                        label="Driving License - Back"
                        fieldName="documents.drivingLicense.back"
                        dispatch={dispatch}
                        required
                      />
                    </Col>
                  </Row>
                </Section>

                <Section title="Vehicle Details">
                  <Row>
                    <Col md={4}>
                      <TextInput name="documents.vehicleDetails.type" label="Vehicle Type" rules={requiredField('Vehicle Type')} />
                    </Col>
                    <Col md={4}>
                      <TextInput name="documents.vehicleDetails.brand" label="Brand" rules={requiredField('Brand')} />
                    </Col>
                    <Col md={4}>
                      <TextInput
                        name="documents.vehicleDetails.modelName"
                        label="Model"
                        rules={{
                          required: 'Model is required',
                          pattern: {
                            value: /^[a-zA-Z0-9\s]+$/,
                            message: 'Model can only contain letters and numbers'
                          }
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <NumberInput
                        name="documents.vehicleDetails.yearOfManufacture"
                        label="Year"
                        min={1900}
                        max={new Date().getFullYear()}
                        rules={{
                          required: 'Year is required',
                          validate: (value) => {
                            const num = Number(value);
                            if (String(value).length !== 4) return 'Year must be exactly 4 digits';
                            if (num < 1900 || num > new Date().getFullYear())
                              return `Year must be between 1900 and ${new Date().getFullYear()}`;
                            return true;
                          }
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <TextInput
                        name="documents.vehicleDetails.registrationNumber"
                        label="Registration No"
                        rules={requiredField('Registration No')}
                      />
                    </Col>
                    <Col md={6}>
                      <FileUploadField
                        label="RC Certificate"
                        fieldName="documents.vehicleDetails.registrationCertificate"
                        dispatch={dispatch}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <FileUploadField
                        label="Insurance Certificate"
                        fieldName="documents.vehicleDetails.insuranceCertificate"
                        dispatch={dispatch}
                        required
                      />
                    </Col>
                  </Row>
                </Section>
              </Card.Body>

              <Card.Footer className="d-flex justify-content-end gap-2 bg-white border-top sticky-bottom">
                <Button variant="outline-secondary" onClick={() => navigate('/driver-management')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {isEdit ? 'Update Driver' : 'Add Driver'}
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        </FormProvider>
      </div>
    </MainCard>
  );
};

export default DriverForm;
