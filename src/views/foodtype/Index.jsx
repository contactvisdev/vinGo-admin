import { useFoodTypeTable, useFoodTypeForm, useFoodTypeDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import FoodTypeFormModal from './FormModal';
import { PLACEHOLDER_50 } from '../../utils/placeholders';

const FoodTypePage = () => {
  const { foodTypeList, pagination, onPageChange, first, rows, loading: tableLoading } = useFoodTypeTable();

  const { form: foodTypeForm, modal: foodTypeModal, dispatch } = useFoodTypeForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useFoodTypeDelete();

  const loading = tableLoading || foodTypeForm.loading || deleteLoading;

  const columns = [
    {
      name: 'Image',
      accessor: 'image',
      body: (row) => (
        <img
          src={row.image}
          alt={row.foodType}
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          className="rounded shadow-sm"
          onError={(e) => {
            e.target.src = PLACEHOLDER_50;
          }}
        />
      )
    },
    {
      name: 'Food Type',
      accessor: 'foodType',
      sortable: true,
      body: (row) => row.foodType || 'N/A'
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
          : 'N/A'
    }
  ];

  const actionTemplate = (row) => (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => foodTypeModal.handleOpenEdit(row)}
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
        <TopTitleCard title="Food Type Management" />
      </div>

      <div className="d-flex justify-content-end gap-2 mb-2">
        <Button variant="primary" onClick={foodTypeModal.handleOpenAdd} disabled={loading}>
          + Add Food Type
        </Button>
      </div>

      {!loading && foodTypeList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No food types found</p>
        </div>
      ) : (
        <TableContainer
          list={foodTypeList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="food-type-table"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      <FoodTypeFormModal modal={foodTypeModal} form={foodTypeForm} dispatch={dispatch} />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this food type?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FoodTypePage;
