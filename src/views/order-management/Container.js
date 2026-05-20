import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetOrdersQuery, useDeleteOrderMutation } from '../../store/api/orderApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';

/**
 * Hook for handling the order list table, pagination, and loading state.
 */
export const useOrderTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || null;
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const { data: categoryList } = useGetCategoriesQuery();
  const {
    data: ordersData,
    isLoading: fetchingOrders,
    isFetching: refetchingOrders
  } = useGetOrdersQuery({ page, limit: rows, categoryId }, { skip: categoryId === null });

  const responseData = ordersData?.data || ordersData || {};
  const orderList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || ordersData?.pagination || {};
  const count = pagination?.totalCount || pagination?.totalItems || 0;
  const tabList = categoryList ? categoryList.map((cat) => ({ label: cat.name, value: cat._id })) : [];

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  useEffect(() => {
    if (!categoryList || categoryList.length === 0) return;

    const hasTabFromUrl = tabFromUrl && categoryList.some((cat) => cat._id === tabFromUrl);
    const selectedCategoryId = hasTabFromUrl ? tabFromUrl : categoryList[0]._id;

    if (selectedCategoryId !== categoryId) {
      setCategoryId(selectedCategoryId);
    }
    if (selectedCategoryId !== activeTab) {
      setActiveTab(selectedCategoryId);
    }
  }, [categoryList, tabFromUrl, categoryId, activeTab]);

  const onPageChange = (e) => {
    navigate(`/order-management?tab=${activeTab || tabFromUrl || ''}&page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  const onTabChange = async (selectedTabId) => {
    setCategoryId(selectedTabId);
    setActiveTab(selectedTabId);
    navigate(`/order-management?tab=${selectedTabId}&page=1&rows=${rows}`);
  };

  return {
    orderList,
    pagination,
    count,
    onPageChange,
    first,
    rows,
    loading: fetchingOrders || refetchingOrders,
    selectedOrders,
    setSelectedOrders,
    navigate,
    onTabChange,
    tabList,
    activeTab
  };
};

/**
 * Hook for handling order deletion logic and confirmation modal.
 */
export const useOrderDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrdersForDelete, setSelectedOrdersForDelete] = useState([]);
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const confirmDelete = (orderId) => {
    setSelectedOrderId(orderId);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      let ids = [];
      if (selectedOrdersForDelete?.length > 0) {
        ids = selectedOrdersForDelete;
      } else if (selectedOrderId) {
        ids = [selectedOrderId];
      }

      if (ids.length > 0) {
        await deleteOrder({ ids }).unwrap();
        setSelectedOrdersForDelete([]);
        setSelectedOrderId(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  return {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    selectedOrdersForDelete,
    setSelectedOrdersForDelete,
    loading: isDeleting
  };
};
