import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetTermsPoliciesQuery,
  useCreateTermsPolicyMutation,
  useUpdateTermsPolicyMutation,
  useDeleteTermsPolicyMutation
} from '../../store/api/termsPolicyApi';

const USER_TYPE_TABS = [
  { label: 'Customer', value: 'customer' },
  { label: 'Merchant', value: 'merchant' },
  { label: 'Driver', value: 'driver' }
];

export const useTermsPolicyTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'customer';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const {
    data: termsPoliciesData,
    isLoading: fetchingTermsPolicies,
    isFetching: refetchingTermsPolicies
  } = useGetTermsPoliciesQuery({ userType: activeTab });

  const termsPolicyList = Array.isArray(termsPoliciesData) ? termsPoliciesData : [];
  const pagination = termsPoliciesData?.pagination || {};

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const onPageChange = (e) => {
    navigate(`/terms-policy?tab=${activeTab}&page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  const onTabChange = (selectedTab) => {
    setActiveTab(selectedTab);
    navigate(`/terms-policy?tab=${selectedTab}&page=1&rows=${rows}`);
  };

  return {
    termsPolicyList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: fetchingTermsPolicies || refetchingTermsPolicies,
    onTabChange,
    tabList: USER_TYPE_TABS,
    activeTab
  };
};

export const useTermsPolicyForm = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [createTermsPolicy, { isLoading: isCreating }] = useCreateTermsPolicyMutation();
  const [updateTermsPolicy, { isLoading: isUpdating }] = useUpdateTermsPolicyMutation();

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
      title: '',
      content: '',
      type: '',
      userType: ''
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({ title: '', content: '', type: '', userType: '' });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      title: item.title || '',
      content: item.content || '',
      type: item.type || '',
      userType: item.userType || ''
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing && selectedItem) {
        await updateTermsPolicy({ id: selectedItem._id, payload: data }).unwrap();
      } else {
        await createTermsPolicy(data).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save terms/policy:', err);
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

  return { form, modal };
};

export const useTermsPolicyDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteTermsPolicy, { isLoading: isDeleting }] = useDeleteTermsPolicyMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteTermsPolicy(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete terms/policy:', err);
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
