import { useStoreTypeTable, useStoreTypeForm, useStoreTypeDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import TabSection from '../../components/TabSection';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import StoreTypeFormModal from './FormModal';

const StoreTypePage = () => {
  const {
    storeTypeList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: tableLoading,
    onTabChange,
    tabList,
    activeTab
  } = useStoreTypeTable();

  const { form: storeTypeForm, modal: storeTypeModal } = useStoreTypeForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useStoreTypeDelete();

  const loading = tableLoading || storeTypeForm.loading || deleteLoading;

  const columns = [
    {
      name: 'Store Type',
      accessor: 'storeType',
      sortable: true,
      body: (row) => row.storeType || 'N/A'
    },
    {
      name: 'Category',
      accessor: 'categoryName',
      sortable: true,
      body: (row) => row.categoryId?.name || row.categoryName || 'N/A'
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
        onClick={() => storeTypeModal.handleOpenEdit(row)}
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
        <TopTitleCard title="Store Type Management" />
      </div>

      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
        <TabSection tabs={tabList} onTabChange={onTabChange} activeTab={activeTab} loading={loading} />
        <Button variant="primary" onClick={storeTypeModal.handleOpenAdd} disabled={loading}>
          + Add Store Type
        </Button>
      </div>

      {!loading && storeTypeList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No store types found</p>
        </div>
      ) : (
        <TableContainer
          list={storeTypeList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="store-type-table"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      <StoreTypeFormModal modal={storeTypeModal} form={storeTypeForm} />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this store type?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default StoreTypePage;
