import React from 'react';
import { Button } from 'react-bootstrap';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useOrderTable, useOrderDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import TabSection from '../../components/TabSection';
import ConfirmModal from '../../components/modals/ConfirmModal';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';

const OrderPage = () => {
  const {
    orderList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: tableLoading,
    selectedOrders,
    setSelectedOrders,
    navigate,
    onTabChange,
    tabList,
    activeTab
  } = useOrderTable();

  const {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    loading: deleteLoading,
    selectedOrdersForDelete,
    setSelectedOrdersForDelete
  } = useOrderDelete();

  const loading = tableLoading || deleteLoading;
  const columns = [
    {
      name: 'Customer',
      accessor: 'customerName',
      sortable: true,
      body: (row) => {
        if (!row.customerName) return '-';
        return `${row.customerName}`;
      }
    },
    {
      name: 'Merchant',
      accessor: 'orders',
      sortable: false,
      body: (row) => {
        if (!row?.orders || row.orders.length === 0) return 'N/A';
        const firstOrder = row.orders[0];
        return firstOrder.ownerName || 'N/A';
      }
    },
    {
      name: 'Total',
      accessor: 'orders',
      sortable: false,
      body: (row) => {
        if (!row?.orders || row.orders.length === 0) return 'N/A';
        const firstOrder = row.orders[0];
        return firstOrder.totalAmount ? `${firstOrder.currency || 'USD'} ${firstOrder.totalAmount.toFixed(2)}` : '-';
      }
    },
    {
      name: 'Status',
      accessor: 'orders',
      sortable: false,
      body: (row) => {
        if (!row?.orders || row.orders.length === 0) return 'N/A';
        // Get the status from the first order
        const firstOrder = row.orders[0];
        const status = firstOrder.status;

        const statusClass = {
          pending: 'bg-warning-subtle text-warning',
          delivered: 'bg-success-subtle text-success',
          cancelled: 'bg-danger-subtle text-danger'
        };

        return (
          <span className={`px-2 py-1 rounded-pill text-capitalize ${statusClass[status] || 'bg-secondary-subtle text-secondary'}`}>
            {status}
          </span>
        );
      }
    },
    {
      name: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      body: (row) =>
        new Date(row.createdAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
    }
  ];

  const actionTemplate = (row) => (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        title="View"
        onClick={() => navigate(`/order-management/view/${row._id}`)}
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        title="edit"
        onClick={() => navigate(`/order-management/edit/${row._id}`)}
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
        title="Delete"
        onClick={() => confirmDelete(row._id)}
      >
        <Trash size={16} />
      </button>
    </div>
  );

  return (
    <div className="container-fluid">
      {/* Page Title */}
      <div className="mb-4">
        <TopTitleCard title="Order Management" />
      </div>
      <TabSection tabs={tabList} onTabChange={onTabChange} activeTab={activeTab} loading={loading} />
      {/* Delete Selected Orders Button */}
      <div className="d-flex justify-content-end">
        {selectedOrders?.length > 0 && (
          <Button
            variant="danger"
            onClick={() => {
              setSelectedOrdersForDelete(selectedOrders);
              setDeleteDialogVisible(true);
            }}
            disabled={loading}
          >
            Delete Selected ({selectedOrders.length})
          </Button>
        )}
      </div>

      {!loading && orderList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No orders found</p>
        </div>
      ) : (
        <TableContainer
          list={orderList}
          columns={columns}
          selectionMode="multiple"
          selectedItems={selectedOrders}
          setSelectedItems={setSelectedOrders}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          loading={loading}
          pagination={pagination}
          ActionTemplate="Actions"
          tableClass="order-table"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message={
          selectedOrdersForDelete?.length > 1
            ? `Are you sure you want to delete ${selectedOrdersForDelete.length} selected orders?`
            : 'Are you sure you want to delete this order?'
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

export default OrderPage;
