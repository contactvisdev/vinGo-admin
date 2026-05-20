import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetCustomersQuery, useDeleteCustomerMutation } from '../../store/api/customerApi';

/**
 * Hook for handling the customer list table, pagination, and loading state.
 */
export const useCustomerTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const { data: customersData, isLoading: fetchingCustomers } = useGetCustomersQuery({ page, limit: rows });

  const responseData = customersData?.data || customersData || {};
  const customerList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || customersData?.pagination || {};
  const count = pagination?.totalCount || pagination?.totalItems || 0;

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/customer-management?page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  return {
    customerList,
    pagination,
    count,
    onPageChange,
    first,
    rows,
    loading: fetchingCustomers,
    selectedCustomers,
    setSelectedCustomers,
    navigate
  };
};

/**
 * Hook for handling the customer form logic.
 */
export const useCustomerForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({ mode: 'onChange' });

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
 * Hook for handling customer deletion logic and confirmation modal.
 */
export const useCustomerDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomersForDelete, setSelectedCustomersForDelete] = useState([]);
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const confirmDelete = (customerId) => {
    setSelectedCustomerId(customerId);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      let ids = [];
      if (selectedCustomersForDelete?.length > 0) {
        ids = selectedCustomersForDelete;
      } else if (selectedCustomerId) {
        ids = [selectedCustomerId];
      }

      if (ids.length > 0) {
        await deleteCustomer({ ids }).unwrap();
        setSelectedCustomersForDelete([]);
        setSelectedCustomerId(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  return {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    selectedCustomersForDelete,
    setSelectedCustomersForDelete,
    loading: isDeleting
  };
};
