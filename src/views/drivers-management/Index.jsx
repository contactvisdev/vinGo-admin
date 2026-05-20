import React from 'react';
import { useDriverTable, useDriverDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import { Eye, Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';

const DriverPage = () => {
  const {
    driverList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: tableLoading,
    selectedDrivers,
    setSelectedDrivers,
    navigate
  } = useDriverTable();

  const {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    loading: deleteLoading,
    selectedDriversForDelete,
    setSelectedDriversForDelete
  } = useDriverDelete();

  const loading = tableLoading || deleteLoading;

  const columns = [
    {
      name: 'Full Name',
      accessor: 'fullName',
      sortable: true,
      body: (row) => (row?.firstName || row?.lastName ? `${row.firstName || ''} ${row.lastName || ''}`.trim() : 'N/A')
    },
    {
      name: 'Email',
      accessor: 'email',
      sortable: true,
      body: (row) => row?.email || 'N/A'
    },
    {
      name: 'Phone',
      accessor: 'phone',
      sortable: true,
      body: (row) => row?.phone || '-'
    },
    {
      name: 'Rating',
      accessor: 'rating',
      sortable: true,
      body: (row) => row?.rating ?? 'N/A'
    },
    // {
    //     name: "Verified",
    //     accessor: "isVerified",
    //     body: (row) => (
    //         <span
    //             className={`px-2 py-1 text-sm rounded-full ${row?.isVerified ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
    //                 }`}
    //         >
    //             {row?.isVerified ? "Verified" : "Not Verified"}
    //         </span>
    //     ),
    // },
    {
      name: 'Status',
      accessor: 'status',
      body: (row) => (
        <span
          className={`px-2 py-1 text-sm rounded-pill ${
            row.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'
          }`}
        >
          {row?.status && row.status.toUpperCase()}
        </span>
      )
    },
    {
      name: 'Document Verification',
      accessor: 'isDocumentVerified',
      body: (row) => (
        <span
          className={`px-2 py-1 text-sm rounded-pill ${
            row.isDocumentVerified ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
          }`}
        >
          {row.isDocumentVerified ? 'VERIFIED' : 'PENDING'}
        </span>
      )
    },
    {
      name: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      body: (row) =>
        row?.createdAt
          ? new Date(row.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : '-'
    }
  ];

  const actionTemplate = (row) => (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => navigate(`/driver-management/view/${row._id}`)}
        title="View"
        disabled={loading}
      >
        <Eye size={16} />
      </button>

      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => navigate(`/driver-management/edit/${row._id}`)}
        title="Edit"
        disabled={loading}
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => confirmDelete(row?._id)}
        title="Delete"
        disabled={loading}
      >
        <Trash size={16} />
      </button>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <TopTitleCard title="Driver Management" />
      </div>

      {/* Add + Delete Buttons */}
      <div className="d-flex justify-content-end gap-2 mb-2">
        <Button variant="primary" onClick={() => navigate('/driver-management/add')} disabled={loading}>
          + Add New Driver
        </Button>

        {selectedDrivers?.length > 0 && (
          <Button
            variant="danger"
            onClick={() => {
              setSelectedDriversForDelete(selectedDrivers);
              setDeleteDialogVisible(true);
            }}
            disabled={loading}
          >
            Delete Selected ({selectedDrivers.length})
          </Button>
        )}
      </div>

      {!loading && driverList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No drivers found</p>
        </div>
      ) : (
        <TableContainer
          list={driverList}
          columns={columns}
          selectionMode="multiple"
          selectedItems={selectedDrivers}
          setSelectedItems={setSelectedDrivers}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          tableClass="driver-table"
          loading={loading}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message={
          selectedDriversForDelete?.length > 1
            ? `Are you sure you want to delete ${selectedDriversForDelete.length} selected drivers?`
            : 'Are you sure you want to delete this driver?'
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

export default DriverPage;
