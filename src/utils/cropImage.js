const IMAGE_SIGNATURES = [
  { bytes: [0xff, 0xd8, 0xff] }, // JPEG
  { bytes: [0x89, 0x50, 0x4e, 0x47] }, // PNG
  { bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF
  { bytes: [0x52, 0x49, 0x46, 0x46], offset8: [0x57, 0x45, 0x42, 0x50] }, // WebP
  { bytes: [0x42, 0x4d] }, // BMP
  { bytes: [0x00, 0x00, 0x01, 0x00] }, // ICO
  { bytes: [0x49, 0x49, 0x2a, 0x00] }, // TIFF (little-endian)
  { bytes: [0x4d, 0x4d, 0x00, 0x2a] } // TIFF (big-endian)
];

export const isValidImageSignature = async (file) => {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return IMAGE_SIGNATURES.some((sig) => {
    const headMatch = sig.bytes.every((b, i) => bytes[i] === b);
    if (!headMatch) return false;
    if (sig.offset8) return sig.offset8.every((b, i) => bytes[8 + i] === b);
    return true;
  });
};

export const getCroppedImg = (image, crop) => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }
        resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.95
    );
  });
};
