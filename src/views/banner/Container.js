import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useReorderBannersMutation
} from '../../store/api/bannerApi';
import { useGetMerchantsQuery } from '../../store/api/merchantApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';

export const useBannerTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get('tab') || 'active';
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [first, setFirst] = useState(0);

  const {
    data: bannersData,
    isLoading: fetchingBanners,
    isFetching: refetchingBanners
  } = useGetBannersQuery({ page, limit: rows, status: activeTab });

  const bannerList = useMemo(
    () => (Array.isArray(bannersData?.data) ? bannersData.data : Array.isArray(bannersData) ? bannersData : []),
    [bannersData]
  );
  const pagination = bannersData?.pagination || {};

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/banner?tab=${activeTab}&page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/banner?tab=${tab}&page=1&rows=${rows}`);
  };

  return {
    bannerList,
    pagination,
    onPageChange,
    first,
    rows,
    page,
    activeTab,
    handleTabChange,
    loading: fetchingBanners,
    isFetching: refetchingBanners
  };
};

export const useBannerReorder = (bannerList, page, rows) => {
  const [orderedList, setOrderedList] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [reorderBanners, { isLoading: isReordering }] = useReorderBannersMutation();

  useEffect(() => {
    setOrderedList(bannerList);
  }, [bannerList]);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const newList = [...orderedList];
    const [movedItem] = newList.splice(dragIndex, 1);
    newList.splice(overIndex, 0, movedItem);
    setOrderedList(newList);

    const pageOffset = (page - 1) * rows;
    const banners = newList.map((item, index) => ({
      id: item._id,
      sortOrder: pageOffset + index + 1
    }));

    try {
      await reorderBanners(banners).unwrap();
    } catch (err) {
      console.error('Failed to reorder banners:', err);
      setOrderedList(bannerList);
    }

    setDragIndex(null);
    setOverIndex(null);
  };

  return {
    orderedList,
    dragIndex,
    overIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    isReordering
  };
};

export const useBannerForm = () => {
  const dispatch = useDispatch();
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

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
      merchantId: '',
      categoryId: '',
      image: '',
      startsOn: '',
      expiresOn: ''
    }
  });

  const selectedCategoryId = watch('categoryId');
  const prevCategoryId = useRef(selectedCategoryId);

  useEffect(() => {
    if (prevCategoryId.current && prevCategoryId.current !== selectedCategoryId) {
      setValue('merchantId', '');
    }
    prevCategoryId.current = selectedCategoryId;
  }, [selectedCategoryId, setValue]);

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: merchantsData, isFetching: merchantsLoading } = useGetMerchantsQuery(
    { categoryId: selectedCategoryId },
    { skip: !selectedCategoryId }
  );

  const categoryOptions = useMemo(() => {
    if (!categoriesData) return [];
    const nested = categoriesData?.data || categoriesData?.list || categoriesData;
    const list = Array.isArray(nested) ? nested : [];
    return list.map((c) => ({ value: c._id, label: c.name || c.categoryName || c._id }));
  }, [categoriesData]);

  const merchantOptions = useMemo(() => {
    if (!merchantsData) return [];
    const nested = merchantsData?.data?.data || merchantsData?.data?.list || merchantsData?.data;
    const list = Array.isArray(nested) ? nested : Array.isArray(merchantsData) ? merchantsData : [];
    return list.map((m) => ({ value: m._id, label: m.business?.businessName || m.businessName || m._id }));
  }, [merchantsData]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    reset({ title: '', merchantId: '', categoryId: '', image: '', startsOn: '', expiresOn: '' });
    setShowFormModal(true);
  };

  const toLocalDatetime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    reset({
      title: item.title,
      merchantId: item.merchantId?._id || item.merchantId || '',
      categoryId: item.categoryId?._id || item.categoryId || '',
      image: item.image,
      startsOn: toLocalDatetime(item.startsOn),
      expiresOn: toLocalDatetime(item.expiresOn)
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        startsOn: data.startsOn ? new Date(data.startsOn).toISOString() : undefined,
        expiresOn: data.expiresOn ? new Date(data.expiresOn).toISOString() : undefined
      };
      if (isEditing && selectedItem) {
        await updateBanner({ id: selectedItem._id, payload }).unwrap();
      } else {
        await createBanner(payload).unwrap();
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Failed to save banner:', err);
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
    dispatch,
    merchantOptions,
    categoryOptions,
    selectedCategoryId,
    categoriesLoading,
    merchantsLoading
  };
};

export const useBannerDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteBanner(itemToDelete._id).unwrap();
        setItemToDelete(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete banner:', err);
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
