import React from 'react';
import { useRestaurantTable, useRestaurantDelete } from './Container';
import { Pencil, Trash, Eye } from 'lucide-react';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../../assets/lottie/empty.json';
import TableContainer from '../../../components/tables/TableContainer';
import TopTitleCard from '../../../components/cards/CustomCard';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import TabSection from '../../../components/TabSection';

const Index = () => {
  const {
    merchantList,
    pagination,
    onPageChange,
    first,
    rows,
    count,
    loading: tableLoading,
    selectedMerchants,
    setSelectedMerchants,
    navigate,
    activeTab,
    handleTabChange
  } = useRestaurantTable();

  const {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    loading: deleteLoading,
    selectedMerchantsForDelete,
    setSelectedMerchantsForDelete
  } = useRestaurantDelete();

  const loading = tableLoading || deleteLoading;

  const columns = [
    {
      name: 'Owner Name',
      accessor: 'ownerName',
      sortable: true,
      body: (rowData) => rowData?.ownerDetails?.ownerName || 'N/A'
    },
    {
      name: 'Email',
      accessor: 'email',
      sortable: true,
      body: (rowData) => rowData?.ownerDetails?.email || 'N/A'
    },
    {
      name: 'Phone',
      accessor: 'phone',
      sortable: true,
      body: (rowData) => rowData?.ownerDetails?.phone || 'N/A'
    },
    {
      name: 'Business Name',
      accessor: 'business.businessName',
      sortable: true,
      body: (rowData) => (
        <span className="d-inline-block text-truncate" style={{ maxWidth: '220px' }} title={rowData?.business?.businessName || '-'}>
          {rowData?.business?.businessName || '-'}
        </span>
      )
    },
    {
      name: 'Verified',
      accessor: 'isVerified',
      body: (rowData) => (
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            rowData?.status === 'approved'
              ? 'bg-success-subtle text-success'
              : rowData?.status === 'rejected'
                ? 'bg-danger-subtle text-danger'
                : 'bg-warning-subtle text-warning'
          }`}
        >
          {rowData?.status === 'approved' ? 'Approved' : rowData?.status === 'rejected' ? 'Rejected' : 'Pending'}
        </span>
      )
    },
    {
      name: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      body: (rowData) =>
        new Date(rowData?.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
    }
  ];

  const actionTemplate = (rowData) => {
    return (
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
          onClick={() => navigate(`/merchant-management/restaurants/view/${rowData._id}?tab=${activeTab}`)}
          title="view"
          disabled={loading}
        >
          <Eye size={16} />
        </button>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
          onClick={() => navigate(`/merchant-management/restaurants/edit/${rowData._id}?tab=${activeTab}`)}
          title="Edit"
          disabled={loading}
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
          onClick={() => confirmDelete(rowData?._id)}
          title="Delete"
          disabled={loading}
        >
          <Trash size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <TopTitleCard title="Restaurants" />
      </div>

      <TabSection
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        loading={loading}
        addButtonText="+ Add New Restaurant"
        onAddClick={() => navigate('/merchant-management/restaurants/add')}
        additionalButtons={
          selectedMerchants?.length > 0 && (
            <Button
              variant="danger"
              onClick={() => {
                setSelectedMerchantsForDelete(selectedMerchants);
                setDeleteDialogVisible(true);
              }}
              disabled={loading}
            >
              Delete Selected ({selectedMerchants.length})
            </Button>
          )
        }
        tabOptions={[
          { key: 'pending', label: 'Pending Listing' },
          { key: 'approved', label: 'Approved Listing' },
          { key: 'rejected', label: 'Rejected Listing' }
        ]}
      />
      {!loading && merchantList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No restaurants found</p>
        </div>
      ) : (
        <TableContainer
          list={merchantList}
          columns={columns}
          selectionMode="multiple"
          selectedItems={selectedMerchants}
          setSelectedItems={setSelectedMerchants}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          count={count}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          tableClass="merchant-table"
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message={
          selectedMerchantsForDelete?.length > 1
            ? `Are you sure you want to delete ${selectedMerchantsForDelete.length} selected restaurants?`
            : 'Are you sure you want to delete this restaurant?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Index;
