import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

export const DeleteDialog = ({ visible, onHide, text, onDelete, loading }) => {
  return (
    <Modal show={visible} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Body className="text-center py-4 px-3">
        <p className="fs-5 fw-semibold mb-4">{text}</p>

        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-secondary" className="px-4" onClick={onHide} disabled={loading}>
            Cancel
          </Button>

          <Button variant="danger" className="px-4 d-flex align-items-center justify-content-center" onClick={onDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
