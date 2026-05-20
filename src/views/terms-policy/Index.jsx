import { useTermsPolicyTable, useTermsPolicyForm, useTermsPolicyDelete } from './Container';
import TableContainer from '../../components/tables/TableContainer';
import TopTitleCard from '../../components/cards/CustomCard';
import TabSection from '../../components/TabSection';
import { Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import TermsPolicyFormModal from './FormModal';

const TermsPolicyPage = () => {
  const {
    termsPolicyList,
    pagination,
    onPageChange,
    first,
    rows,
    loading: tableLoading,
    onTabChange,
    tabList,
    activeTab
  } = useTermsPolicyTable();

  const { form: termsPolicyForm, modal: termsPolicyModal } = useTermsPolicyForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useTermsPolicyDelete();

  const loading = tableLoading || termsPolicyForm.loading || deleteLoading;

  const columns = [
    // {
    //   name: 'Title',
    //   accessor: 'title',
    //   sortable: true,
    //   body: (row) => row.title || 'N/A'
    // },
    {
      name: 'Type',
      accessor: 'type',
      sortable: true,
      body: (row) => {
        const typeMap = {
          terms_conditions: 'Terms & Conditions',
          privacy_policy: 'Privacy Policy'
        };
        return typeMap[row.type] || 'N/A';
      }
    },
    {
      name: 'User Type',
      accessor: 'userType',
      sortable: true,
      body: (row) => (row.userType ? row.userType.charAt(0).toUpperCase() + row.userType.slice(1) : 'N/A')
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
        onClick={() => termsPolicyModal.handleOpenEdit(row)}
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
        <TopTitleCard title="Terms & Policy Management" />
      </div>

      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
        <TabSection tabs={tabList} onTabChange={onTabChange} activeTab={activeTab} loading={loading} />
        <Button variant="primary" onClick={termsPolicyModal.handleOpenAdd} disabled={loading}>
          + Add Terms/Policy
        </Button>
      </div>

      {!loading && termsPolicyList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No terms or policies found</p>
        </div>
      ) : (
        <TableContainer
          list={termsPolicyList}
          columns={columns}
          onPageChange={onPageChange}
          first={first}
          rows={rows}
          actions={actionTemplate}
          pagination={pagination}
          ActionTemplate="Actions"
          selectionMode="none"
          tableClass="terms-policy-table"
          loading={loading}
        />
      )}

      {/* Form Modal */}
      <TermsPolicyFormModal modal={termsPolicyModal} form={termsPolicyForm} />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this terms/policy?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TermsPolicyPage;
