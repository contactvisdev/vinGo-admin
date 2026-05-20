import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { singleFileUpload } from '../../utils/singleFileUpload';
import { Form, Spinner } from 'react-bootstrap';
import { requiredField } from '../../utils/validationSchema';
import { isValidImageSignature } from '../../utils/cropImage';
import { uploadApi } from '../../store/api/uploadApi';
import ImageCropModal from './ImageCropModal';

const MAX_SIZE = 4 * 1024 * 1024;

export const FileUploadField = ({
  label,
  fieldName,
  watch,
  setValue,
  dispatch,
  errors,
  setLocalFile,
  setLoading,
  register,
  trigger,
  clearErrors,
  required,
  onlyImage = false,
  aspectRatio = null,
  sizeHint = null
}) => {
  const methods = useFormContext();
  const reduxDispatch = useDispatch();

  const effectiveWatch = watch || methods?.watch;
  const effectiveSetValue = setValue || methods?.setValue;
  const effectiveErrors = errors || methods?.formState?.errors;
  const effectiveRegister = register || methods?.register;
  const effectiveTrigger = trigger || methods?.trigger;
  const effectiveClearErrors = clearErrors || methods?.clearErrors;
  const effectiveDispatch = dispatch || reduxDispatch;

  const file = effectiveWatch ? effectiveWatch(fieldName) : null;

  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fieldError = fieldName.split('.').reduce((obj, key) => obj?.[key], effectiveErrors);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  const handleSetLoading = (val) => {
    setUploading(val);
    setLoading?.(val);
  };

  const handleDirectUpload = (e) => {
    singleFileUpload({
      fieldName,
      setValue: effectiveSetValue,
      dispatch: effectiveDispatch,
      setLocalFile,
      setLoading: handleSetLoading,
      imageOnly: onlyImage,
      setErrorMessage: setUploadError,
      trigger: effectiveTrigger,
      clearErrors: effectiveClearErrors
    })(e);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // If no aspectRatio or not an image, use direct upload
    if (!aspectRatio || !selectedFile.type.startsWith('image/')) {
      handleDirectUpload(e);
      return;
    }

    // Validate image
    if (selectedFile.size > MAX_SIZE) {
      setUploadError('Max file size is 4MB');
      e.target.value = '';
      return;
    }

    const validSig = await isValidImageSignature(selectedFile);
    if (!validSig) {
      setUploadError('Invalid image file');
      e.target.value = '';
      return;
    }

    setUploadError('');

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.onerror = () => {
      setUploadError('Failed to read the file. Please try again.');
    };
    reader.readAsDataURL(selectedFile);
    e.target.value = '';
  };

  const handleCropConfirm = async (croppedFile) => {
    setCropModalOpen(false);
    setCropImageSrc(null);

    if (!croppedFile) {
      setUploadError('Failed to crop image. Please try again.');
      return;
    }

    setLocalFile?.(croppedFile);
    if (effectiveSetValue) {
      effectiveSetValue(fieldName, croppedFile, { shouldValidate: false });
    }

    handleSetLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', croppedFile);

      const { axiosInstance } = await import('../../services/api');
      const endPoints = (await import('../../services/endpoints')).default;

      const response = await axiosInstance.post(endPoints.UPLOAD_SINGLE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const result = response.data;
      const url = result?.data?.url || result?.url;
      if (url && effectiveSetValue) {
        effectiveSetValue(fieldName, url, { shouldValidate: true, shouldDirty: true });
        effectiveClearErrors?.(fieldName);
        effectiveTrigger?.(fieldName);
      }
    } catch (e) {
      console.error(e);
      setUploadError('Upload failed. Please try again.');
    } finally {
      handleSetLoading(false);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCropImageSrc(null);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>

      <div className="position-relative">
        <Form.Control
          type="file"
          accept={onlyImage || aspectRatio ? 'image/*' : 'image/*,application/pdf'}
          disabled={uploading}
          onChange={handleFileChange}
          isInvalid={!!fieldError || !!uploadError}
        />
        {uploading && (
          <div
            className="position-absolute d-flex align-items-center gap-1 text-muted"
            style={{ right: 12, top: '50%', transform: 'translateY(-50%)' }}
          >
            <Spinner animation="border" size="sm" style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: '0.75rem' }}>Uploading...</span>
          </div>
        )}
      </div>

      <input
        type="hidden"
        {...(effectiveRegister ? effectiveRegister(fieldName, required ? requiredField(`${label} is required`) : {}) : {})}
      />
      {!uploading && !sizeHint && (
        <Form.Text className="text-muted">
          Upload {label} {onlyImage || aspectRatio ? '(image only)' : '(image or PDF)'}
        </Form.Text>
      )}
      {!uploading && sizeHint && <Form.Text className="text-muted d-block">{sizeHint}</Form.Text>}
      {fieldError && <div className="text-danger small mt-1">{fieldError.message}</div>}

      {uploadError && <div className="text-danger small mt-1">{uploadError}</div>}

      {!uploading && (file instanceof File || (typeof file === 'string' && file !== '')) && (
        <div className="mt-2">
          <strong>Preview:</strong>{' '}
          {file instanceof File ? (
            file.type.startsWith('image/') ? (
              previewUrl && <img src={previewUrl} alt={label} style={{ maxHeight: '150px' }} className="img-fluid rounded border mt-2" />
            ) : (
              !onlyImage &&
              previewUrl && (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              )
            )
          ) : (
            <a href={file} target="_blank" rel="noopener noreferrer">
              View Uploaded File
            </a>
          )}
        </div>
      )}

      <ImageCropModal
        show={cropModalOpen}
        onHide={handleCropCancel}
        imageSrc={cropImageSrc}
        aspectRatio={aspectRatio}
        onConfirm={handleCropConfirm}
      />
    </Form.Group>
  );
};
