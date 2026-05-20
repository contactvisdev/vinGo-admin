import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../../store/api/couponApi';

export const useCouponsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'active';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [first, setFirst] = useState(0);

  const {
    data: couponsData,
    isLoading: fetchingCoupons,
    isFetching: refetchingCoupons
  } = useGetCouponsQuery({
    page,
    limit: rows,
    status: activeTab
  });

  const couponsBuckets = couponsData?.activeCoupons || {};
  const couponList = Array.isArray(couponsBuckets?.list) ? couponsBuckets.list : [];
  const pagination = couponsBuckets?.pagination || {};
  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/coupons?tab=${activeTab}&page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/coupons?tab=${tab}&page=1&rows=${rows}`);
  };

  return {
    couponList,
    pagination,
    onPageChange,
    activeTab,
    setActiveTab,
    handleTabChange,
    first,
    rows,
    loading: fetchingCoupons || refetchingCoupons
  };
};

export const useCouponsForm = () => {
  const dispatch = useDispatch();
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
    setValue,
    setError,
    trigger,
    clearErrors
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      discountPercentage: '',
      minimumAmount: '',
      expiresOn: '',
      startsOn: '',
      status: 'active'
    }
  });

  const watchedTitle = watch('title');

  useEffect(() => {
    if (typeof watchedTitle !== 'string') return;
    const upperTitle = watchedTitle.toUpperCase();
    if (watchedTitle !== upperTitle) {
      setValue('title', upperTitle, { shouldValidate: true, shouldDirty: true });
    }
  }, [watchedTitle, setValue]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({
      title: '',
      description: '',
      discountPercentage: '',
      minimumAmount: '',
      expiresOn: '',
      startsOn: '',
      status: 'active'
    });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      title: item?.title || '',
      description: item?.description || '',
      discountPercentage: item?.discountPercentage ?? '',
      minimumAmount: item?.minimumAmount ?? '',
      startsOn: item?.startsOn ? item.startsOn.split('T')[0] : '',
      expiresOn: item?.expiresOn ? item.expiresOn.split('T')[0] : '',
      status: item?.status || 'active'
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    const discountPercentage = Number(data.discountPercentage);
    const minimumAmount = Number(data.minimumAmount);
    const selectedDate = data.expiresOn ? new Date(data.expiresOn) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(discountPercentage) || discountPercentage < 0) {
      setError('discountPercentage', { type: 'manual', message: 'Discount percentage must be 0 or greater' });
      return;
    }

    if (Number.isNaN(minimumAmount) || minimumAmount < 0) {
      setError('minimumAmount', { type: 'manual', message: 'Minimum amount must be 0 or greater' });
      return;
    }

    const startDate = data.startsOn ? new Date(data.startsOn) : null;
    if (!startDate || Number.isNaN(startDate.getTime()) || startDate < today) {
      setError('startsOn', { type: 'manual', message: 'Start date cannot be before today' });
      return;
    }

    if (!selectedDate || Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      setError('expiresOn', { type: 'manual', message: 'Expiry date cannot be before today' });
      return;
    }

    if (selectedDate <= startDate) {
      setError('expiresOn', { type: 'manual', message: 'Expiry date must be after start date' });
      return;
    }

    try {
      const payload = {
        ...data,
        title: (data.title || '').toUpperCase().trim(),
        discountPercentage,
        minimumAmount,
        startsOn: data.startsOn,
        expiresOn: data.expiresOn
      };

      if (isEditing && selectedItem) {
        await updateCoupon({ id: selectedItem._id, payload }).unwrap();
      } else {
        await createCoupon(payload).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save coupon:', err);
    }
  };

  const form = {
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

export const useCouponsDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteCoupon(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
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
