import { useFeeTable, useFeeForm, useFeeDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import FeeFormModal from './FormModal';

const FeePage = () => {
  const { feeList, pagination, onPageChange, first, rows, loading: tableLoading } = useFeeTable();

  const { form: feeForm, modal: feeModal, dispatch } = useFeeForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useFeeDelete();

  const loading = tableLoading || feeForm.loading || deleteLoading;

  const columns = [
    {
      name: 'Distance Range',
      accessor: 'distanceRange',
      sortable: true,
      body: (row) => row.distanceRange || '-'
    },
    {
      name: 'Delivery Fee',
      accessor: 'deliveryFee',
      sortable: true,
      body: (row) => `${row.deliveryFee || 0} ${row.currency || 'AWG'}`
    },
    {
      name: 'Service Fee',
      accessor: 'serviceFee',
      sortable: true,
      body: (row) => `${row.serviceFee || 0} ${row.currency || 'AWG'}`
    },
    {
      name: 'Tax',
      accessor: 'tax',
      sortable: true,
      body: (row) => `${row.tax || 0} ${row.currency || 'AWG'}`
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
        onClick={() => feeModal.handleOpenEdit(row)}
        title="Edit"
        disabled={loading}
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => confirmDelete(row)}
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
        <TopTitleCard title="Fee Management" />
      </div>

      <div className="d-flex justify-content-end gap-2 mb-2">
        <Button variant="primary" onClick={feeModal.handleOpenAdd} disabled={loading}>
          + Add Fee
        </Button>
      </div>

      {!loading && feeList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No fees found</p>
        </div>
      ) : (
        <TableContainer
          list={feeList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="fee-table"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      <FeeFormModal modal={feeModal} form={feeForm} dispatch={dispatch} />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this fee entry?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FeePage;
