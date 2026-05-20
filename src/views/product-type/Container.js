import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetProductTypesQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation
} from '../../store/api/productTypeApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { CheckLg } from 'react-bootstrap-icons';

export const useProductTypeTable = () => {
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
    data: productTypesData,
    isLoading: fetchingProductTypes,
    isFetching: refetchingProductTypes
  } = useGetProductTypesQuery({ page, limit: rows, categoryId }, { skip: categoryId === null });

  const responseData = productTypesData?.data || productTypesData || {};
  const productTypeList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || productTypesData?.pagination || {};
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
    navigate(`/product-type?tab=${activeTab || tabFromUrl || ''}&page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  const onTabChange = (selectedTabId) => {
    setCategoryId(selectedTabId);
    setActiveTab(selectedTabId);
    navigate(`/product-type?tab=${selectedTabId}&page=1&rows=${rows}`);
  };

  return {
    productTypeList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: fetchingProductTypes || refetchingProductTypes,
    onTabChange,
    tabList,
    activeTab
  };
};

/**
 * Hook for handling the product type form logic, including create/update mutations and modal state.
 */
export const useProductTypeForm = () => {
  const dispatch = useDispatch();
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [createProductType, { isLoading: isCreating }] = useCreateProductTypeMutation();
  const [updateProductType, { isLoading: isUpdating }] = useUpdateProductTypeMutation();

  // Fetch categories for the dropdown
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ page: 1, limit: 100 });
  const categoryList = Array.isArray(categoriesData?.data || categoriesData) ? categoriesData?.data || categoriesData : [];
  const categoryOptions = categoryList
    .filter((cat) => !['restaurant', 'store', 'stores'].includes(cat.name?.toLowerCase()))
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
      name: '',
      categoryId: '',
      productTypeImg: ''
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({ name: '', categoryId: '', productTypeImg: '' });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      name: item.name,
      categoryId: item.categoryId?._id || item.categoryId || '',
      productTypeImg: item.productTypeImg || ''
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing && selectedItem) {
        await updateProductType({ id: selectedItem._id, payload: data }).unwrap();
      } else {
        await createProductType(data).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save product type:', err);
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

/**
 * Hook for handling product type deletion logic and confirmation modal.
 */
export const useProductTypeDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteProductType, { isLoading: isDeleting }] = useDeleteProductTypeMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteProductType(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete product type:', err);
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
