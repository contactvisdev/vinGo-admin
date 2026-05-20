import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetTipsQuery, useCreateTipMutation, useUpdateTipMutation, useDeleteTipMutation } from '../../store/api/tipApi';

/**
 * Hook for handling the tip list table, pagination, and loading state.
 */
export const useTipTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);

  const { data: tipsData, isLoading: fetchingTips } = useGetTipsQuery({ page, limit: rows });

  const responseData = tipsData?.data || tipsData || {};
  const tipList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || tipsData?.pagination || {};

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/tips?page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  return {
    tipList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: fetchingTips
  };
};

/**
 * Hook for handling the tip form logic, including create/update mutations and modal state.
 */
export const useTipForm = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [createTip, { isLoading: isCreating }] = useCreateTipMutation();
  const [updateTip, { isLoading: isUpdating }] = useUpdateTipMutation();

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
      tip_percentage: ''
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({ tip_percentage: '' });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      tip_percentage: item.tip_percentage
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = { tip_percentage: Number(data.tip_percentage) };
      if (isEditing && selectedItem) {
        await updateTip({ id: selectedItem._id, payload }).unwrap();
      } else {
        await createTip(payload).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save tip:', err);
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
    modal
  };
};

/**
 * Hook for handling tip deletion logic and confirmation modal.
 */
export const useTipDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteTip, { isLoading: isDeleting }] = useDeleteTipMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteTip(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete tip:', err);
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
