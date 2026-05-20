import React, { useCallback, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '../../utils/cropImage';

const ImageCropModal = ({ show, onHide, imageSrc, aspectRatio, onConfirm }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState(undefined);
  const [confirming, setConfirming] = useState(false);

  const onImageLoaded = useCallback(
    (e) => {
      imgRef.current = e.currentTarget;
      const { width, height } = e.currentTarget;
      const size = Math.min(width, height, 250);
      const ratio = aspectRatio || 1;

      let cropWidth, cropHeight;
      if (ratio >= 1) {
        cropWidth = size;
        cropHeight = size / ratio;
      } else {
        cropHeight = size;
        cropWidth = size * ratio;
      }

      setCrop({
        unit: 'px',
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    },
    [aspectRatio]
  );

  const handleConfirm = useCallback(async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;
    setConfirming(true);
    const file = await getCroppedImg(imgRef.current, crop);
    setConfirming(false);
    onConfirm(file);
  }, [crop, onConfirm]);

  const handleClose = useCallback(() => {
    setCrop(undefined);
    onHide();
  }, [onHide]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        {imageSrc && (
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={aspectRatio} minWidth={50} minHeight={50}>
            <img src={imageSrc} onLoad={onImageLoaded} alt="Crop preview" style={{ maxHeight: '400px', maxWidth: '100%' }} />
          </ReactCrop>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={confirming || !crop?.width}>
          {confirming ? 'Processing...' : 'Confirm Crop'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageCropModal;
