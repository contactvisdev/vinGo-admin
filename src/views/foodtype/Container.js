import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetFoodTypesQuery,
  useCreateFoodTypeMutation,
  useUpdateFoodTypeMutation,
  useDeleteFoodTypeMutation
} from '../../store/api/foodTypeApi';

/**
 * Hook for handling the food type list table, pagination, and loading state.
 */
export const useFoodTypeTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);

  const { data: foodTypesData, isLoading: fetchingFoodTypes } = useGetFoodTypesQuery({ page, limit: rows });

  const responseData = foodTypesData?.data || foodTypesData || {};
  const foodTypeList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || foodTypesData?.pagination || {};

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/food-type?page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  return {
    foodTypeList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: fetchingFoodTypes
  };
};

/**
 * Hook for handling the food type form logic, including create/update mutations and modal state.
 */
export const useFoodTypeForm = () => {
  const dispatch = useDispatch();
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [createFoodType, { isLoading: isCreating }] = useCreateFoodTypeMutation();
  const [updateFoodType, { isLoading: isUpdating }] = useUpdateFoodTypeMutation();

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
      foodType: '',
      image: ''
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({ foodType: '', image: '' });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      foodType: item.foodType,
      image: item.image
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing && selectedItem) {
        await updateFoodType({ id: selectedItem._id, payload: data }).unwrap();
      } else {
        await createFoodType(data).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save food type:', err);
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
    loading: isCreating || isUpdating || uploadLoading,
    setUploadLoading
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
 * Hook for handling food type deletion logic and confirmation modal.
 */
export const useFoodTypeDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteFoodType, { isLoading: isDeleting }] = useDeleteFoodTypeMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteFoodType(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete food type:', err);
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
