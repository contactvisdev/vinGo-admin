import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  useGetBusinessStaffQuery,
  useGetBusinessStaffByIdQuery,
  useCreateBusinessStaffMutation,
  useUpdateBusinessStaffMutation,
  useDeleteBusinessStaffMutation
} from '../../../store/api/Staff';

/**
 * SINGLE SOURCE OF TRUTH — Business Staff Hook
 */
const PERMISSION_TEMPLATE = {
  orders: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canUpdateStatus: false,
    canViewDetails: false,
    canExport: false
  },
  menu: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageCategories: false,
    canManageItems: false,
    canManagePromotionalCategories: false,
    canPublish: false
  },
  staff: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canAssignRoles: false,
    canManagePermissions: false,
    canViewDetails: false
  },
  reports: {
    canView: false,
    canExport: false,
    canViewAnalytics: false,
    canViewSales: false,
    canViewOrders: false,
    canViewReviews: false,
    canViewDashboard: false
  },
  payments: {
    canView: false,
    canProcess: false,
    canRefund: false,
    canViewTransactions: false,
    canManageWallet: false,
    canViewPayouts: false
  },
  reviews: {
    canView: false,
    canRespond: false,
    canDelete: false,
    canModerate: false
  },
  settings: {
    canView: false,
    canEdit: false,
    canManageProfile: false,
    canManageHours: false,
    canManageCategories: false,
    canManageNotifications: false,
    canManageWallet: false
  },
  analytics: {
    canView: false,
    canViewSales: false,
    canViewOrders: false,
    canViewCustomer: false,
    canExport: false
  },
  dashboard: {
    canView: false,
    canViewOverview: false,
    canViewRecentOrders: false,
    canViewMetrics: false
  }
};

export const useBusinessStaff = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  /* =========================
     DETECT ADD/EDIT MODE FROM ROUTE
  ========================== */
  const isAddRoute = location.pathname.includes('/staff/add');
  const isEditRoute = location.pathname.includes('/staff/edit');

  /* =========================
     PAGINATION / TABLE LOGIC
  ========================== */
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);

  const { data, isLoading: listLoading } = useGetBusinessStaffQuery({ page, limit: rows });

  const responseData = data?.data || data || {};
  const staffList = responseData?.data || responseData?.list || (Array.isArray(responseData) ? responseData : []);

  const pagination = responseData?.pagination || {};

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/business-staff?page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  /* =========================
     FORM / CREATE / UPDATE
  ========================== */
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Extract ID from URL params for edit mode
  const urlParams = new URLSearchParams(location.search);
  const idFromUrl = location.pathname.split('/').pop();

  const effectiveId = isEditRoute ? idFromUrl : selectedId;

  const { data: staffByIdData, isLoading: singleLoading } = useGetBusinessStaffByIdQuery(effectiveId, {
    skip: !effectiveId || !isEditRoute
  });

  const [createStaff, { isLoading: creating }] = useCreateBusinessStaffMutation();
  const [updateStaff, { isLoading: updating }] = useUpdateBusinessStaffMutation();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      ownerId: '',
      profilePic: '',
      idVerification: { front: '', back: '' },
      roles: [],
      permissions: PERMISSION_TEMPLATE
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue
  } = methods;

  // Prefill form on edit
  useEffect(() => {
    if (staffByIdData?.data && isEditRoute) {
      const formattedData = {
        ...staffByIdData.data,
        // Ensure permissions are at the root level with the correct structure
        permissions: staffByIdData.data?.roles?.[0]?.permissions || PERMISSION_TEMPLATE
      };
      reset(formattedData);
    }
  }, [staffByIdData, isEditRoute, reset]);

  const openAddModal = () => {
    setSelectedId(null);
    reset();
    setShowFormModal(true);
  };

  const openEditModal = (id) => {
    setSelectedId(id);
    setShowFormModal(true);
  };
  const normalizePermissions = (permissions = {}) => {
    const clean = {};

    Object.keys(permissions).forEach((module) => {
      clean[module] = {};
      Object.keys(permissions[module] || {}).forEach((key) => {
        clean[module][key] = Boolean(permissions[module][key]);
      });
    });

    return clean;
  };

  const onSubmit = async (formData) => {
    try {
      const normalizedPermissions = normalizePermissions(formData.permissions);

      // Parse merchant IDs from comma-separated string to array
      let merchantIds = [];
      if (formData.roles?.[0]?.merchantIds) {
        merchantIds =
          typeof formData.roles[0].merchantIds === 'string'
            ? formData.roles[0].merchantIds
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean)
            : Array.isArray(formData.roles[0].merchantIds)
              ? formData.roles[0].merchantIds
              : [];
      }

      // Transform to match the required payload structure
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ownerId: formData.ownerId,
        profilePic: formData.profilePic,
        idVerification: {
          front: formData.idVerification?.front || '',
          back: formData.idVerification?.back || ''
        },
        roles: [
          {
            role: formData.roles?.[0]?.role || '',
            merchantIds: merchantIds,
            permissions: normalizedPermissions
          }
        ]
      };

      if (isEditRoute && effectiveId) {
        await updateStaff({ id: effectiveId, payload }).unwrap();
      } else {
        await createStaff(payload).unwrap();
      }

      navigate('/merchant-management/staff');
      reset();
    } catch (err) {
      console.error('Staff save failed:', err);
    }
  };

  /* =========================
     DELETE LOGIC
  ========================== */
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [deleteStaff, { isLoading: deleting }] = useDeleteBusinessStaffMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (!itemToDelete?._id) return;

      await deleteStaff({ id: itemToDelete._id }).unwrap();
      setItemToDelete(null);
      setDeleteDialogVisible(false);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  /* =========================
     FINAL RETURN
  ========================== */
  return {
    // table
    staffList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: listLoading,

    // form
    form: {
      ...methods,
      errors,
      loading: creating || updating || singleLoading
    },
    modal: {
      show: showFormModal,
      setShow: setShowFormModal,
      isEditing: isEditRoute,
      openAddModal,
      openEditModal,
      onSubmit
    },

    // delete
    delete: {
      deleteDialogVisible,
      setDeleteDialogVisible,
      confirmDelete,
      handleDelete,
      loading: deleting
    },

    dispatch
  };
};
