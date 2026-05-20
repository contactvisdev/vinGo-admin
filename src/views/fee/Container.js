import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetFeesQuery, useCreateFeeMutation, useUpdateFeeMutation, useDeleteFeeMutation } from '../../store/api/feeApi';

/**
 * Hook for handling the fee list table, pagination, and loading state.
 */
export const useFeeTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);

  const { data: feesData, isLoading: fetchingFees } = useGetFeesQuery({
    page,
    limit: rows,
    showErrorToast: true
  });

  const responseData = feesData?.data || feesData || {};
  const feeList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || feesData?.pagination || {};

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/fee?page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  return {
    feeList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: fetchingFees
  };
};

/**
 * Hook for handling the fee form logic, including create/update mutations and modal state.
 */
export const useFeeForm = () => {
  const dispatch = useDispatch();
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [createFee, { isLoading: isCreating }] = useCreateFeeMutation();
  const [updateFee, { isLoading: isUpdating }] = useUpdateFeeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
    trigger,
    clearErrors
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      distanceRange: '',
      deliveryFee: '',
      serviceFee: '',
      tax: '',
      tip: '',
      currency: ''
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({
      distanceRange: '',
      deliveryFee: '',
      serviceFee: '',
      tax: '',
      tip: '',
      currency: ''
    });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      distanceRange: item.distanceRange ?? '',
      deliveryFee: item.deliveryFee ?? '',
      serviceFee: item.serviceFee ?? '',
      tax: item.tax ?? '',
      tip: item.tip ?? '',
      currency: item.currency || 'AWG'
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      // Convert numeric fields from string to number if necessary
      const payload = {
        ...data,
        deliveryFee: Number(data.deliveryFee),
        serviceFee: Number(data.serviceFee),
        tax: Number(data.tax),
        tip: Number(data.tip)
      };

      if (isEditing && selectedItem) {
        await updateFee({
          id: selectedItem._id,
          payload,
          showSuccessToast: true,
          showErrorToast: true
        }).unwrap();
      } else {
        await createFee({
          payload,
          showSuccessToast: true,
          showErrorToast: true
        }).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save fee:', err);
    }
  };

  const form = {
    register,
    handleSubmit,
    errors,
    control,
    watch,
    setValue,
    trigger,
    clearErrors,
    loading: isCreating || isUpdating
  };

  const modal = {
    show: showFormModal,
    setShow: setShowFormModal,
    isEditing,
    handleOpenAdd: handleOpenAddModal,
    handleOpenEdit: handleOpenEditModal,
    onSubmit
  };

  return {
    form,
    modal,
    dispatch
  };
};

/**
 * Hook for handling fee deletion logic and confirmation modal.
 */
export const useFeeDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteFee, { isLoading: isDeleting }] = useDeleteFeeMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteFee({
          id: itemToDelete._id,
          showSuccessToast: true,
          showErrorToast: true
        }).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete fee:', err);
    }
  };

  return {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    loading: isDeleting
  };
};
