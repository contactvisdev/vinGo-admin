import { useCouponsTable, useCouponsForm, useCouponsDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button, Badge } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import CouponFormModal from './FormModal';
import TabSection from '../../components/TabSection';

const CouponsPage = () => {
  const { couponList, pagination, onPageChange, first, rows, loading: tableLoading, activeTab, handleTabChange } = useCouponsTable();
  const { form: couponForm, modal: couponModal } = useCouponsForm();
  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useCouponsDelete();

  const loading = tableLoading || couponForm.loading || deleteLoading;

  const columns = [
    {
      name: 'Code',
      accessor: 'title',
      sortable: true,
      body: (row) => row.title || '-'
    },
    {
      name: 'Description',
      accessor: 'description',
      body: (row) => row.description || '-'
    },
    {
      name: 'Discount %',
      accessor: 'discountPercentage',
      sortable: true,
      body: (row) => row.discountPercentage ?? '-'
    },
    {
      name: 'Minimum Amount',
      accessor: 'minimumAmount',
      sortable: true,
      body: (row) => row.minimumAmount ?? '-'
    },
    {
      name: 'Status',
      accessor: 'status',
      sortable: true,
      body: (row) => <Badge bg={row?.status === 'active' ? 'success' : 'secondary'}>{row?.status || '-'}</Badge>
    },
    {
      name: 'Expires On',
      accessor: 'expiresOn',
      sortable: true,
      body: (row) =>
        row?.expiresOn
          ? new Date(row.expiresOn).toLocaleDateString('en-GB', {
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
        onClick={() => couponModal.handleOpenEdit(row)}
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
        <TopTitleCard title="Coupons Management" />
      </div>

      <TabSection
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        loading={loading}
        addButtonText="+ Add Coupon"
        onAddClick={couponModal.handleOpenAdd}
        tabOptions={[
          { key: 'active', label: 'Active Listing' },
          { key: 'inactive', label: 'Inactive Listing' },
          { key: 'expired', label: 'Expired Listing' }
        ]}
      />

      {!loading && couponList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No {activeTab} coupons found</p>
        </div>
      ) : (
        <TableContainer
          list={couponList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="coupons-table"
          loading={loading}
        />
      )}

      <CouponFormModal modal={couponModal} form={couponForm} />

      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this coupon?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CouponsPage;
