import { useCategoryTable, useCategoryForm, useCategoryDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import CategoryFormModal from './FormModal';
import { PLACEHOLDER_50 } from '../../utils/placeholders';

const CategoryPage = () => {
  const { categoryList, pagination, onPageChange, first, rows, loading: tableLoading } = useCategoryTable();

  const { form: categoryForm, modal: categoryModal, dispatch } = useCategoryForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useCategoryDelete();

  const loading = tableLoading || categoryForm.loading || deleteLoading;

  const columns = [
    {
      name: 'Image',
      accessor: 'image',
      body: (row) => (
        <img
          src={row.image}
          alt={row.name}
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          className="rounded shadow-sm"
          onError={(e) => {
            e.target.src = PLACEHOLDER_50;
          }}
        />
      )
    },
    {
      name: 'Name',
      accessor: 'name',
      sortable: true,
      body: (row) => row.name || 'N/A'
    },
    // {
    //   name: 'Sort',
    //   accessor: 'sort',
    //   sortable: true,
    //   body: (row) => row.sort ?? 'N/A'
    // },
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
        onClick={() => categoryModal.handleOpenEdit(row)}
        title="Edit"
        disabled={loading}
      >
        <Pencil size={16} />
      </button>

      {/* <button
        type="button"
        className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => confirmDelete(row)}
        title="Delete"
        disabled={loading}
      >
        <Trash size={16} />
      </button> */}
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <TopTitleCard title="Category Management" />
      </div>

      {/* <div className="d-flex justify-content-end gap-2 mb-2">
        <Button variant="primary" onClick={categoryModal.handleOpenAdd} disabled={loading}>
          + Add Category
        </Button>
      </div> */}

      {!loading && categoryList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No categories found</p>
        </div>
      ) : (
        <TableContainer
          list={categoryList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="category-table"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      <CategoryFormModal modal={categoryModal} form={categoryForm} dispatch={dispatch} />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CategoryPage;
