import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from 'react-bootstrap';

import { useBusinessStaff } from './Container';
import TableContainer from '../../../components/tables/TableContainer';
import TopTitleCard from '../../../components/cards/CustomCard';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import StaffFormModal from './FormModal';
import { useNavigate } from 'react-router-dom';
const Staff = () => {
  const navigate = useNavigate();
  const {
    // table
    staffList,
    pagination,
    onPageChange,
    first,
    rows,
    loading,

    // form
    form,
    modal,

    // delete
    delete: deleteActions
  } = useBusinessStaff();

  const columns = [
    {
      name: 'Name',
      accessor: 'name',
      sortable: true,
      body: (row) => row.name || '-'
    },
    {
      name: 'Email',
      accessor: 'email',
      body: (row) => row.email || '-'
    },
    {
      name: 'Phone',
      accessor: 'phone',
      body: (row) => row.phone || '-'
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
        onClick={() => navigate(`/merchant-management/Staff/view/${row._id}`)}
        title="view"
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => navigate(`/merchant-management/staff/edit/${row._id}`)}
        disabled={loading}
        title="Edit"
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => deleteActions.confirmDelete(row)}
        disabled={loading}
        title="Delete"
      >
        <Trash size={16} />
      </button>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <TopTitleCard title="Business Staff Management" />
      </div>

      <div className="d-flex justify-content-end gap-2 mb-3">
        <Button variant="primary" onClick={() => navigate('/merchant-management/staff/add')} disabled={loading}>
          + Add Staff
        </Button>
      </div>

      {!loading && staffList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <p className="text-muted">No staff found</p>
        </div>
      ) : (
        <TableContainer
          list={staffList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      {/* <StaffFormModal modal={modal} form={form} /> */}

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteActions.deleteDialogVisible}
        onHide={() => deleteActions.setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this staff member?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteActions.loading}
        onConfirm={deleteActions.handleDelete}
      />
    </div>
  );
};

export default Staff;
