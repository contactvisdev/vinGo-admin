import { useTipTable, useTipForm, useTipDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import TipFormModal from './FormModal';

const TipsPage = () => {
  const { tipList, pagination, onPageChange, first, rows, loading: tableLoading } = useTipTable();

  const { form: tipForm, modal: tipModal } = useTipForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useTipDelete();

  const loading = tableLoading || tipForm.loading || deleteLoading;

  const columns = [
    {
      name: 'Tip Percentage',
      accessor: 'tip_percentage',
      sortable: true,
      body: (row) => (row.tip_percentage != null ? `${row.tip_percentage}%` : 'N/A')
    },
    {
      name: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      body: (row) =>
        row?.created_on
          ? new Date(row.created_on).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : 'N/A'
    }
  ];

  const actionTemplate = (row) => (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => tipModal.handleOpenEdit(row)}
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
        <TopTitleCard title="Tips Management" />
      </div>

      <div className="d-flex justify-content-end gap-2 mb-2">
        <Button variant="primary" onClick={tipModal.handleOpenAdd} disabled={loading}>
          + Add Tip
        </Button>
      </div>

      {!loading && tipList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No tips found</p>
        </div>
      ) : (
        <TableContainer
          list={tipList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="tips-table"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      <TipFormModal modal={tipModal} form={tipForm} />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this tip?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TipsPage;
