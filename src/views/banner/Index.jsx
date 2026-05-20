import { useBannerTable, useBannerForm, useBannerDelete, useBannerReorder } from './Container';
import TopTitleCard from '../../components/cards/CustomCard';
import { GripVertical, Pencil, Trash } from 'lucide-react';
import ConfirmModal from '../../components/modals/ConfirmModal';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/lottie/empty.json';
import BannerFormModal from './FormModal';
import { PLACEHOLDER_80x50 } from '../../utils/placeholders';
import TabSection from '../../components/TabSection';

const BannerPage = () => {
  const {
    bannerList,
    pagination,
    onPageChange,
    first,
    rows,
    page,
    loading: tableLoading,
    isFetching,
    activeTab,
    handleTabChange
  } = useBannerTable();

  const {
    form: bannerForm,
    modal: bannerModal,
    dispatch,
    merchantOptions,
    categoryOptions,
    selectedCategoryId,
    categoriesLoading,
    merchantsLoading
  } = useBannerForm();

  const { deleteDialogVisible, setDeleteDialogVisible, confirmDelete, handleDelete, loading: deleteLoading } = useBannerDelete();

  const { orderedList, dragIndex, overIndex, handleDragStart, handleDragOver, handleDragEnd, isReordering } = useBannerReorder(
    bannerList,
    page,
    rows
  );

  const loading = tableLoading || bannerForm.loading || deleteLoading;
  const busy = loading || isReordering || isFetching;

  const pageSize = pagination.limit ?? rows;
  const currentPage = pagination.currentPage ?? Math.floor(first / pageSize) + 1;
  const totalPages = pagination.totalPages ?? 1;
  const totalItems = pagination.totalItems ?? 0;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePageChange = (pageNumber) => {
    if (!onPageChange || busy) return;
    const backendPage = pageNumber - 1;
    onPageChange({
      page: backendPage,
      first: backendPage * pageSize,
      rows: pageSize
    });
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <TopTitleCard title="Banner Management" />
      </div>

      <TabSection
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        loading={busy}
        addButtonText="+ Add Banner"
        onAddClick={bannerModal.handleOpenAdd}
        tabOptions={[
          { key: 'active', label: 'Active Listing' },
          { key: 'inactive', label: 'Inactive Listing' }
        ]}
      />

      {!loading && orderedList?.length === 0 ? (
        <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div style={{ width: '200px' }}>
            <Lottie animationData={emptyAnimation} loop />
          </div>
          <p className="mt-3 text-muted">No {activeTab} banners found</p>
        </div>
      ) : (
        <div className="modern-table-card banner-table">
          <div className="table-responsive">
            <Table hover className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: '3rem' }}></th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Merchant</th>
                  <th>Category</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(pageSize || 5)].map((_, rowIndex) => (
                      <tr key={`skeleton-${rowIndex}`}>
                        {[...Array(7)].map((_, colIndex) => (
                          <td key={`skeleton-col-${colIndex}`}>
                            <div className="skeleton-loader"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  : orderedList.map((row, index) => (
                      <tr
                        key={row._id || index}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        style={{
                          opacity: dragIndex === index ? 0.5 : 1,
                          borderTop: overIndex === index && dragIndex !== index ? '2px solid #0d6efd' : undefined,
                          cursor: 'grab',
                          transition: 'background-color 0.15s'
                        }}
                        className={overIndex === index && dragIndex !== index ? 'bg-light' : ''}
                      >
                        <td style={{ width: '3rem' }}>
                          <GripVertical size={18} className="text-muted" style={{ cursor: 'grab' }} />
                        </td>
                        <td>
                          <img
                            src={row.image}
                            alt={row.title}
                            style={{ width: '80px', height: '50px', objectFit: 'cover' }}
                            className="rounded shadow-sm"
                            onError={(e) => {
                              e.target.src = PLACEHOLDER_80x50;
                            }}
                          />
                        </td>
                        <td>{row.title || 'N/A'}</td>
                        <td>{row.merchantName || 'N/A'}</td>
                        <td>{row.categoryName || 'N/A'}</td>
                        <td>
                          {row?.createdAt
                            ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              onClick={() => bannerModal.handleOpenEdit(row)}
                              title="Edit"
                              disabled={busy}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              onClick={() => confirmDelete(row)}
                              title="Delete"
                              disabled={busy}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          </div>

          {onPageChange && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 px-2">
              <div className="text-muted mb-2 mb-md-0 d-flex align-items-center" style={{ fontSize: '0.875rem' }}>
                Showing <strong className="m-2">{orderedList.length}</strong> of <strong className="m-2">{totalItems}</strong> entries
              </div>

              {totalPages > 0 && (
                <Pagination className="modern-pagination mb-0">
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={!hasPrevPage || busy} />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage || busy} />

                  {[...Array(totalPages)].map((_, i) => {
                    if (totalPages > 7 && i + 1 !== 1 && i + 1 !== totalPages && Math.abs(i + 1 - currentPage) > 2) {
                      if (Math.abs(i + 1 - currentPage) === 3) return <Pagination.Ellipsis key={i + 1} disabled />;
                      return null;
                    }
                    return (
                      <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)} disabled={busy}>
                        {i + 1}
                      </Pagination.Item>
                    );
                  })}

                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage || busy} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={!hasNextPage || busy} />
                </Pagination>
              )}
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <BannerFormModal
        modal={bannerModal}
        form={bannerForm}
        dispatch={dispatch}
        merchantOptions={merchantOptions}
        categoryOptions={categoryOptions}
        selectedCategoryId={selectedCategoryId}
        categoriesLoading={categoriesLoading}
        merchantsLoading={merchantsLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        show={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this banner?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={busy}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BannerPage;
