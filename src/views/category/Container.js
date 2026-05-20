import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../../store/api/categoryApi';

/**
 * Hook for handling the category list table, pagination, and loading state.
 */
export const useCategoryTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);

  const { data: categoriesData, isLoading: fetchingCategories } = useGetCategoriesQuery({ page, limit: rows });

  const responseData = categoriesData?.data || categoriesData || {};
  const categoryList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || categoriesData?.pagination || {};

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/category?page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  return {
    categoryList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: fetchingCategories
  };
};

/**
 * Hook for handling the category form logic, including create/update mutations and modal state.
 */
export const useCategoryForm = () => {
  const dispatch = useDispatch();
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

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
      name: '',
      sort: 1,
      image: ''
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({ name: '', sort: 1, image: '' });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      name: item.name,
      sort: item.sort || 1,
      image: item.image || ''
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        sort: Number(data.sort),
        image: data.image
      };
      if (isEditing && selectedItem) {
        await updateCategory({ id: selectedItem._id, payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save category:', err);
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
 * Hook for handling category deletion logic and confirmation modal.
 */
export const useCategoryDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteCategory(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
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
