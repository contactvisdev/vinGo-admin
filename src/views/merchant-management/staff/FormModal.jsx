import React, { useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import MainCard from 'components/MainCard';
import TopTitleCard from 'components/cards/CustomCard';

import TextInput from 'components/form/TextInput';
import SelectInput from 'components/form/SelectInput';
import PermissionCheckbox from 'components/form/PermissionCheckbox';

import { useBusinessStaff } from '../staff/Container';
import { FileUploadField } from '../../../components/form/FileUploadField';
import { useDispatch } from 'react-redux';

/* ================= ROLE OPTIONS ================= */

const roleList = [
  { label: 'Regional Manager', value: 'REGIONAL_MANAGER' },
  { label: 'Outlet Manager', value: 'OUTLET_MANAGER' },
  { label: 'Staff', value: 'STAFF' },
  { label: 'Accountant', value: 'ACCOUNTANT' }
];

/* ================= PERMISSION CONFIG ================= */

const PERMISSION_CHECKBOXES = [
  {
    module: 'Orders',
    name: 'permissions.orders',
    options: [
      { label: 'View Orders', value: 'canView' },
      { label: 'Create Order', value: 'canCreate' },
      { label: 'Edit Order', value: 'canEdit' },
      { label: 'Delete Order', value: 'canDelete' },
      { label: 'Update Order Status', value: 'canUpdateStatus' },
      { label: 'View Order Details', value: 'canViewDetails' },
      { label: 'Export Orders', value: 'canExport' }
    ]
  },
  {
    module: 'Menu',
    name: 'permissions.menu',
    options: [
      { label: 'View Menu', value: 'canView' },
      { label: 'Create Menu', value: 'canCreate' },
      { label: 'Edit Menu', value: 'canEdit' },
      { label: 'Delete Menu', value: 'canDelete' },
      { label: 'Manage Categories', value: 'canManageCategories' },
      { label: 'Manage Items', value: 'canManageItems' },
      { label: 'Manage Promotional Categories', value: 'canManagePromotionalCategories' },
      { label: 'Publish Menu', value: 'canPublish' }
    ]
  },
  {
    module: 'Staff',
    name: 'permissions.staff',
    options: [
      { label: 'View Staff', value: 'canView' },
      { label: 'Create Staff', value: 'canCreate' },
      { label: 'Edit Staff', value: 'canEdit' },
      { label: 'Delete Staff', value: 'canDelete' },
      { label: 'Assign Roles', value: 'canAssignRoles' },
      { label: 'Manage Permissions', value: 'canManagePermissions' },
      { label: 'View Staff Details', value: 'canViewDetails' }
    ]
  },
  {
    module: 'Reports',
    name: 'permissions.reports',
    options: [
      { label: 'View Reports', value: 'canView' },
      { label: 'Export Reports', value: 'canExport' },
      { label: 'View Analytics', value: 'canViewAnalytics' },
      { label: 'View Sales', value: 'canViewSales' },
      { label: 'View Orders', value: 'canViewOrders' },
      { label: 'View Reviews', value: 'canViewReviews' },
      { label: 'View Dashboard Reports', value: 'canViewDashboard' }
    ]
  },
  {
    module: 'Payments',
    name: 'permissions.payments',
    options: [
      { label: 'View Payments', value: 'canView' },
      { label: 'Process Payments', value: 'canProcess' },
      { label: 'Refund Payments', value: 'canRefund' },
      { label: 'View Transactions', value: 'canViewTransactions' },
      { label: 'Manage Wallet', value: 'canManageWallet' },
      { label: 'View Payouts', value: 'canViewPayouts' }
    ]
  },
  {
    module: 'Reviews',
    name: 'permissions.reviews',
    options: [
      { label: 'View Reviews', value: 'canView' },
      { label: 'Respond to Reviews', value: 'canRespond' },
      { label: 'Delete Reviews', value: 'canDelete' },
      { label: 'Moderate Reviews', value: 'canModerate' }
    ]
  },
  {
    module: 'Settings',
    name: 'permissions.settings',
    options: [
      { label: 'View Settings', value: 'canView' },
      { label: 'Edit Settings', value: 'canEdit' },
      { label: 'Manage Profile', value: 'canManageProfile' },
      { label: 'Manage Business Hours', value: 'canManageHours' },
      { label: 'Manage Categories', value: 'canManageCategories' },
      { label: 'Manage Notifications', value: 'canManageNotifications' },
      { label: 'Manage Wallet', value: 'canManageWallet' }
    ]
  },
  {
    module: 'Analytics',
    name: 'permissions.analytics',
    options: [
      { label: 'View Analytics', value: 'canView' },
      { label: 'View Sales Analytics', value: 'canViewSales' },
      { label: 'View Orders Analytics', value: 'canViewOrders' },
      { label: 'View Customers Analytics', value: 'canViewCustomer' },
      { label: 'Export Analytics', value: 'canExport' }
    ]
  },
  {
    module: 'Dashboard',
    name: 'permissions.dashboard',
    options: [
      { label: 'View Dashboard', value: 'canView' },
      { label: 'View Overview', value: 'canViewOverview' },
      { label: 'View Recent Orders', value: 'canViewRecentOrders' },
      { label: 'View Metrics', value: 'canViewMetrics' }
    ]
  }
];
/* ================= STAFF FORM ================= */

const StaffForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { form, modal } = useBusinessStaff();

  const { isEditing, onSubmit } = modal;

  const { handleSubmit, loading } = form;

  /* ================= BREADCRUMBS ================= */

  const breadcrumbs = [
    { label: 'Staff', url: '/staff-management' },
    {
      label: isEditing ? 'Edit Staff' : 'Add Staff',
      url: isEditing ? `/staff/edit/${id}` : '/staff/add'
    }
  ];

  /* ================= UI ================= */

  return (
    <MainCard>
      <TopTitleCard title="Staff Management" breadcrumbs={breadcrumbs} />

      <FormProvider {...form}>
        <Form onSubmit={handleSubmit(onSubmit)} className={loading ? 'opacity-50 pe-none' : ''}>
          {/* ================= BASIC INFO ================= */}
          <Card className="mb-4">
            <Card.Header className="fw-bold">Basic Information</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <TextInput name="name" label="Full Name" rules={{ required: 'Name is required' }} />
                </Col>

                <Col md={6}>
                  <TextInput name="email" label="Email" rules={{ required: 'Email is required' }} />
                </Col>

                <Col md={6}>
                  <TextInput name="phone" label="Phone" rules={{ required: 'Phone is required' }} />
                </Col>

                <Col md={6}>
                  <SelectInput name="roles.0.role" label="Role" options={roleList} rules={{ required: 'Role is required' }} />
                </Col>
                <Col md={6}>
                  <TextInput name="ownerId" label="Owner ID" placeholder="Enter owner ID" rules={{ required: 'Owner ID is required' }} />
                </Col>
                <Col md={12}>
                  <TextInput
                    name="roles.0.merchantIds"
                    label="Merchant IDs (comma-separated)"
                    placeholder="e.g., 69677f23f71ee91ea292ae39, 6969efaea8c19e1b5db0a440"
                  />
                </Col>
              </Row>

              {/* ================= ID Verification ================= */}
              <Row>
                <Col md={4}>
                  <FileUploadField
                    label="Profile Picture"
                    dispatch={dispatch}
                    fieldName="profilePic"
                    onlyImage
                    required
                    aspectRatio={1}
                    sizeHint="Recommended: 1:1 (e.g. 500 x 500px)"
                  />
                </Col>
                <Col md={4}>
                  <FileUploadField label="ID Proof (Front)" dispatch={dispatch} fieldName="idVerification.front" onlyImage required />
                </Col>

                <Col md={4}>
                  <FileUploadField label="ID Proof (Back)" dispatch={dispatch} fieldName="idVerification.back" onlyImage required />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ================= PERMISSIONS ================= */}
          <Card className="mb-4">
            <Card.Header className="fw-bold">Permissions</Card.Header>
            <Card.Body>
              {PERMISSION_CHECKBOXES.map((section) => (
                <div key={section.name} className="mb-3">
                  <h6 className="mb-2">{section.module}</h6>
                  <Row>
                    {section.options.map((perm) => (
                      <Col md={6} key={perm.value}>
                        <PermissionCheckbox name={section.name} value={perm.value} labelText={perm.label} />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* ================= SUBMIT ================= */}
          <div className="text-center">
            <Button type="submit" variant={isEditing ? 'warning' : 'primary'} disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Staff' : 'Create Staff'}
            </Button>
          </div>
        </Form>
      </FormProvider>
    </MainCard>
  );
};

export default StaffForm;
