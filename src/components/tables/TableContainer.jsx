import React from 'react';
import clsx from 'clsx';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const TableContainer = ({
  list = [],
  columns = [],
  count = 0,
  rows = 10,
  first = 0,
  onPageChange = null,
  selectedItems = [],
  setSelectedItems = null,
  selectionMode = 'multiple',
  actions = null,
  ActionTemplate = 'Actions',
  tableClass = '',
  pagination = {},
  loading = false
}) => {
  const pageSize = pagination.limit ?? rows;

  const currentPage = pagination.currentPage ?? Math.floor(first / pageSize) + 1;

  const totalPages = pagination.totalPages ?? Math.ceil(count / pageSize);

  const totalItems = pagination.totalItems ?? count;

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handleCheckboxChange = (id) => {
    if (!setSelectedItems || loading) return;

    if (selectionMode === 'single') {
      setSelectedItems([id]);
    } else {
      setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }
  };

  const handleSelectAll = () => {
    if (!setSelectedItems || loading) return;

    if (selectedItems.length === list.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(list.map((item) => item._id));
    }
  };

  const handlePageChange = (pageNumber) => {
    if (!onPageChange || loading) return;

    const backendPage = pageNumber - 1;

    onPageChange({
      page: backendPage,
      first: backendPage * pageSize,
      rows: pageSize
    });
  };

  return (
    <div className={clsx('modern-table-card', tableClass)}>
      <div className="table-responsive">
        <Table hover className="modern-table">
          <thead>
            <tr>
              {selectionMode !== 'none' && (
                <th style={{ width: '3rem' }}>
                  {selectionMode === 'multiple' && (
                    <Form.Check
                      type="checkbox"
                      checked={list.length > 0 && selectedItems.length === list.length && !loading}
                      onChange={handleSelectAll}
                      disabled={loading}
                    />
                  )}
                </th>
              )}

              {columns.map((col, index) => (
                <th key={`${col.accessor || col.name || 'col'}-${index}`}>{col.name}</th>
              ))}

              {actions && <th>{ActionTemplate}</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(pageSize || 5)].map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {selectionMode !== 'none' && (
                    <td>
                      <div className="skeleton-loader" style={{ width: '20px' }}></div>
                    </td>
                  )}
                  {columns.map((_, colIndex) => (
                    <td key={`skeleton-col-${colIndex}`}>
                      <div className="skeleton-loader"></div>
                    </td>
                  ))}
                  {actions && (
                    <td>
                      <div className="skeleton-loader" style={{ width: '80%' }}></div>
                    </td>
                  )}
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectionMode !== 'none' ? 1 : 0) + (actions ? 1 : 0)}>
                  <div className="text-center text-muted py-5">
                    <i className="feather icon-info d-block mb-2" style={{ fontSize: '2rem' }}></i>
                    No records found
                  </div>
                </td>
              </tr>
            ) : (
              list.map((row, rowIndex) => (
                <tr key={row._id || rowIndex}>
                  {selectionMode !== 'none' && (
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.includes(row._id)}
                        onChange={() => handleCheckboxChange(row._id)}
                        disabled={loading}
                      />
                    </td>
                  )}

                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{col.body ? col.body(row) : row[col.accessor]}</td>
                  ))}

                  {actions && <td>{typeof actions === 'function' ? actions(row) : <ButtonGroup>{actions}</ButtonGroup>}</td>}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {onPageChange && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 px-2">
          <div className="text-muted mb-2 mb-md-0 d-flex align-items-center" style={{ fontSize: '0.875rem' }}>
            Showing <strong className="m-2">{loading ? 0 : list.length}</strong> of <strong className="m-2">{totalItems}</strong> entries
          </div>

          {totalPages > 0 && (
            <Pagination className="modern-pagination mb-0">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={!hasPrevPage || loading} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage || loading} />

              {[...Array(totalPages)].map((_, i) => {
                // Show pages around current page for cleaner pagination
                if (totalPages > 7 && i + 1 !== 1 && i + 1 !== totalPages && Math.abs(i + 1 - currentPage) > 2) {
                  if (Math.abs(i + 1 - currentPage) === 3) return <Pagination.Ellipsis key={i + 1} disabled />;
                  return null;
                }
                return (
                  <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)} disabled={loading}>
                    {i + 1}
                  </Pagination.Item>
                );
              })}

              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage || loading} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={!hasNextPage || loading} />
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default TableContainer;
