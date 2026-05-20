import React, { useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import BaseModal from './BaseModal';

const variantConfig = {
  danger: {
    icon: 'ti ti-trash',
    iconBg: '#fef2f2',
    iconColor: '#ef4444',
    btnClass: 'btn-confirm-danger'
  },
  warning: {
    icon: 'ti ti-alert-triangle',
    iconBg: '#fffbeb',
    iconColor: '#f59e0b',
    btnClass: 'btn-confirm-warning'
  },
  primary: {
    icon: 'ti ti-info-circle',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    btnClass: 'btn-confirm-primary'
  }
};

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,

  title = 'Confirm action',
  message,

  confirmText = 'Confirm',
  cancelText = 'Cancel',

  confirmVariant = 'danger',
  loading = false
}) => {
  const handleConfirm = useCallback(() => {
    if (!loading && onConfirm) {
      onConfirm();
    }
  }, [loading, onConfirm]);

  const config = variantConfig[confirmVariant] || variantConfig.danger;

  return (
    <BaseModal
      show={show}
      onHide={onHide}
      title={null}
      size="sm"
      closeButton={false}
      dialogClassName="confirm-modal-dialog"
      contentClassName="confirm-modal-content"
    >
      <div className="confirm-modal-body">
        {/* Icon */}
        <div className="confirm-modal-icon" style={{ backgroundColor: config.iconBg }}>
          <i className={config.icon} style={{ color: config.iconColor }} />
        </div>

        {/* Title */}
        <h5 className="confirm-modal-title">{title}</h5>

        {/* Subtitle */}
        <p className="confirm-modal-subtitle">This action cannot be undone</p>

        {/* Message */}
        {message && <div className="confirm-modal-message">{message}</div>}

        {/* Actions */}
        <div className="confirm-modal-actions">
          <Button variant="light" className="confirm-modal-btn-cancel" onClick={onHide} disabled={loading}>
            {cancelText}
          </Button>

          <Button className={`confirm-modal-btn-confirm ${config.btnClass}`} onClick={handleConfirm} disabled={loading}>
            {loading && <Spinner as="span" size="sm" animation="border" className="me-2" />}
            {confirmText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
