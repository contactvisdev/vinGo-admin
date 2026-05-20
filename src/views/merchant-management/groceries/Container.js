import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetGroceriesQuery, useDeleteMerchantMutation } from '../../../store/api/merchantApi';
import { useGetCategoriesQuery } from '../../../store/api/categoryApi';

export const weekDays = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' }
];

export const useGroceryTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'pending';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);
  const [selectedMerchants, setSelectedMerchants] = useState([]);
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const { data: categoryList } = useGetCategoriesQuery();
  const {
    data: merchantsData,
    isLoading: fetchingMerchants,
    isFetching: refetchingMerchants
  } = useGetGroceriesQuery({ page, limit: rows, status: activeTab, categoryId: selectedCategoryId }, { skip: !selectedCategoryId });

  const responseData = merchantsData?.data || merchantsData || {};
  const merchantList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || merchantsData?.pagination || {};
  const count = pagination?.totalCount || pagination?.totalItems || 0;

  useEffect(() => {
    if (categoryList) {
      let categoryToSelect = categoryList?.find((cat) => cat.name.toLowerCase() === 'grocery')?._id;

      if (!categoryToSelect && categoryList && categoryList.length > 0) {
        categoryToSelect = categoryList[0]._id;
      }

      setSelectedCategoryId(categoryToSelect);
    }
  }, [categoryList]);

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/merchant-management/groceries?tab=${activeTab}&page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/merchant-management/groceries?tab=${tab}&page=1&rows=${rows}`, { replace: true });
  };

  return {
    merchantList,
    pagination,
    count,
    onPageChange,
    first,
    rows,
    loading: fetchingMerchants || refetchingMerchants,
    selectedMerchants,
    setSelectedMerchants,
    navigate,
    activeTab,
    setActiveTab,
    handleTabChange,
    categoryList,
    selectedCategoryId
  };
};

/**
 * Hook for handling the grocery form logic.
 */
export const useGroceryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      isVerified: true
    }
  });

  const setLoading = () => {};

  return {
    ...methods,
    errors: methods.formState.errors,
    navigate,
    dispatch,
    setLoading
  };
};

/**
 * Hook for handling grocery deletion logic and confirmation modal.
 */
export const useGroceryDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState(null);
  const [selectedMerchantsForDelete, setSelectedMerchantsForDelete] = useState([]);
  const [deleteMerchant, { isLoading: isDeleting }] = useDeleteMerchantMutation();

  const confirmDelete = (merchantId) => {
    setSelectedMerchantId(merchantId);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      let ids = [];
      if (selectedMerchantsForDelete?.length > 0) {
        ids = selectedMerchantsForDelete;
      } else if (selectedMerchantId) {
        ids = [selectedMerchantId];
      }

      if (ids.length > 0) {
        await deleteMerchant({ ids }).unwrap();
        setSelectedMerchantsForDelete([]);
        setSelectedMerchantId(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete grocery:', err);
    }
  };

  return {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    selectedMerchantsForDelete,
    setSelectedMerchantsForDelete,
    loading: isDeleting
  };
};
