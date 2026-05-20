import React from 'react';
import { useCustomerTable, useCustomerDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import { Pencil, Trash, Eye } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';

const CustomerIndex = () => {
  const {
    customerList,
    pagination,
    onPageChange,
    first,
    rows,
    count,
    loading: tableLoading,
    selectedCustomers,
    setSelectedCustomers,
    navigate
  } = useCustomerTable();

  const {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    loading: deleteLoading,
    selectedCustomersForDelete,
    setSelectedCustomersForDelete
  } = useCustomerDelete();

  const loading = tableLoading || deleteLoading;

  const columns = [
    {
      name: 'Full Name',
      accessor: 'fullName',
      sortable: true,
      body: (rowData) => (rowData?.firstName || rowData?.lastName ? `${rowData?.firstName || ''} ${rowData?.lastName || ''}`.trim() : 'N/A')
    },
    {
      name: 'Email',
      accessor: 'email',
      sortable: true,
      body: (rowData) => rowData?.email || 'N/A'
    },
    {
      name: 'Phone',
      accessor: 'phone',
      sortable: true,
      body: (rowData) => rowData?.phone || 'N/A'
    },
    // {
    //   name: 'Status',
    //   accessor: 'status',
    //   body: (rowData) => (
    //     <span
    //       className={`px-2 py-1 text-sm rounded-full ${
    //         rowData?.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
    //       }`}
    //     >
    //       {rowData?.status === 'active' ? 'Active' : 'Inactive'}
    //     </span>
    //   )
    // },
    {
      name: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      body: (rowData) =>
        rowData?.createdAt
          ? new Date(rowData?.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : '-'
    }
  ];

  const actionTemplate = (rowData) => (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => navigate(`/customer-management/view/${rowData._id}`)}
        title="View"
        disabled={loading}
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => navigate(`/customer-management/edit/${rowData._id}`)}
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

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
        <TopTitleCard title="Customer Management" />
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mb-2">
        <Button variant="primary" onClick={() => navigate('/customer-management/add')} disabled={loading}>
          + Add New Customer
        </Button>

        {selectedCustomers?.length > 0 && (
          <Button
            variant="danger"
            onClick={() => {
              setSelectedCustomersForDelete(selectedCustomers);
              setDeleteDialogVisible(true);
            }}
            disabled={loading}
          >
            Delete Selected ({selectedCustomers.length})
          </Button>
        )}
      </div>

      {!loading && customerList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No customers found</p>
        </div>
      ) : (
        <TableContainer
          list={customerList}
          columns={columns}
          selectionMode="multiple"
          selectedItems={selectedCustomers}
          setSelectedItems={setSelectedCustomers}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          count={count}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          tableClass="customer-table"
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message={
          selectedCustomersForDelete?.length > 1 || selectedCustomersForDelete?.length > 0
            ? `Are you sure you want to delete ${selectedCustomersForDelete.length} selected customers?`
            : 'Are you sure you want to delete this customer?'
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

export default CustomerIndex;
