import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetStoreTypesQuery,
  useCreateStoreTypeMutation,
  useUpdateStoreTypeMutation,
  useDeleteStoreTypeMutation
} from '../../store/api/storeTypeApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';

export const useStoreTypeTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || null;
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);
  const [categoryId, setCategoryId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const { data: categoryList } = useGetCategoriesQuery();
  const {
    data: storeTypesData,
    isLoading: fetchingStoreTypes,
    isFetching: refetchingStoreTypes
  } = useGetStoreTypesQuery({ page, limit: rows, categoryId }, { skip: categoryId === null });

  const responseData = storeTypesData?.data || storeTypesData || {};
  const storeTypeList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || storeTypesData?.pagination || {};
  const excluded = ['restaurant', 'store', 'stores'];
  const filteredCategories = categoryList ? categoryList.filter((cat) => !excluded.includes(cat.name?.toLowerCase())) : [];
  const tabList = filteredCategories.map((cat) => ({ label: cat.name, value: cat._id }));

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  useEffect(() => {
    if (!filteredCategories || filteredCategories.length === 0) return;

    const hasTabFromUrl = tabFromUrl && filteredCategories.some((cat) => cat._id === tabFromUrl);
    const selectedCategoryId = hasTabFromUrl ? tabFromUrl : filteredCategories[0]._id;

    if (selectedCategoryId !== categoryId) {
      setCategoryId(selectedCategoryId);
    }
    if (selectedCategoryId !== activeTab) {
      setActiveTab(selectedCategoryId);
    }
  }, [categoryList, tabFromUrl, categoryId, activeTab]);

  const onPageChange = (e) => {
    navigate(`/store-type?tab=${activeTab || tabFromUrl || ''}&page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  const onTabChange = (selectedTabId) => {
    setCategoryId(selectedTabId);
    setActiveTab(selectedTabId);
    navigate(`/store-type?tab=${selectedTabId}&page=1&rows=${rows}`);
  };

  return {
    storeTypeList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: fetchingStoreTypes || refetchingStoreTypes,
    onTabChange,
    tabList,
    activeTab
  };
};

export const useStoreTypeForm = () => {
  const dispatch = useDispatch();
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [createStoreType, { isLoading: isCreating }] = useCreateStoreTypeMutation();
  const [updateStoreType, { isLoading: isUpdating }] = useUpdateStoreTypeMutation();

  // Fetch categories for the dropdown
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ page: 1, limit: 100 });
  const categoryList = Array.isArray(categoriesData?.data || categoriesData) ? categoriesData?.data || categoriesData : [];
  const categoryOptions = categoryList
    .filter((cat) => cat.name?.toLowerCase() !== 'restaurant')
    .map((cat) => ({
      value: cat._id,
      label: cat.name
    }));

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
      storeType: '',
      categoryId: ''
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({ storeType: '', categoryId: '' });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      storeType: item.storeType,
      categoryId: item.categoryId?._id || item.categoryId || ''
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing && selectedItem) {
        await updateStoreType({ id: selectedItem._id, payload: data }).unwrap();
      } else {
        await createStoreType(data).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save store type:', err);
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
    loading: isCreating || isUpdating,
    categoryOptions,
    categoriesLoading
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

export const useStoreTypeDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteStoreType, { isLoading: isDeleting }] = useDeleteStoreTypeMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteStoreType(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete store type:', err);
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
