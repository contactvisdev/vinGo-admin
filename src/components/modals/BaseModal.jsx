import React from 'react';
import { Modal } from 'react-bootstrap';

const BaseModal = ({
  show,
  onHide,
  title,
  subtitle,
  children,
  footer,

  size = 'md',
  centered = true,
  backdrop = 'static',
  keyboard = false,
  fullscreen,

  closeButton = true,

  dialogClassName = '',
  contentClassName = '',
  bodyClassName = '',
  bodyStyle = {},

  ...rest
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop={backdrop}
      keyboard={keyboard}
      fullscreen={fullscreen}
      dialogClassName={`modern-modal ${dialogClassName}`}
      contentClassName={`modern-modal-content ${contentClassName}`}
      {...rest}
    >
      {(title || closeButton) && (
        <Modal.Header closeButton={!!onHide && closeButton} className="modern-modal-header">
          <div>
            {title && <Modal.Title>{title}</Modal.Title>}
            {subtitle && <div className="modern-modal-subtitle">{subtitle}</div>}
          </div>
        </Modal.Header>
      )}

      <Modal.Body className={`modern-modal-body ${bodyClassName}`} style={bodyStyle}>
        {children}
      </Modal.Body>

      {footer && <Modal.Footer className="modern-modal-footer">{footer}</Modal.Footer>}
    </Modal>
  );
};

export default BaseModal;
