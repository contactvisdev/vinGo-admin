import { useProductTypeTable, useProductTypeForm, useProductTypeDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import TabSection from '../../components/TabSection';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import ProductTypeFormModal from './FormModal';

const ProductTypePage = () => {
  const {
    productTypeList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: tableLoading,
    onTabChange,
    tabList,
    activeTab
  } = useProductTypeTable();

  const { form: productTypeForm, modal: productTypeModal } = useProductTypeForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useProductTypeDelete();

  const loading = tableLoading || productTypeForm.loading || deleteLoading;

  const activeTabObj = tabList?.find((tab) => tab.value === activeTab);
  const isGrocery = activeTabObj?.label?.toLowerCase() === 'grocery';

  const columns = [
    ...(!isGrocery
      ? [
          {
            name: 'Image',
            accessor: 'productTypeImg',
            body: (row) =>
              row.productTypeImg ? (
                <img src={row.productTypeImg} alt={row.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
              ) : (
                'N/A'
              )
          }
        ]
      : []),
    {
      name: 'Name',
      accessor: 'name',
      sortable: true,
      body: (row) => row.name || 'N/A'
    },
    {
      name: 'Category',
      accessor: 'categoryName',
      sortable: true,
      body: (row) => row.categoryName || 'N/A'
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
        onClick={() => productTypeModal.handleOpenEdit(row)}
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
        <TopTitleCard title="Product Type Management" />
      </div>

      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
        <TabSection tabs={tabList} onTabChange={onTabChange} activeTab={activeTab} loading={loading} />

        <Button variant="primary" onClick={productTypeModal.handleOpenAdd} disabled={loading}>
          + Add Product Type
        </Button>
      </div>

      {!loading && productTypeList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-1 text-muted">No product types found</p>
        </div>
      ) : (
        <TableContainer
          list={productTypeList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="product-type-table mt-0!"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      <ProductTypeFormModal modal={productTypeModal} form={productTypeForm} />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this product type?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProductTypePage;
