const LoadingOverlay = () => (
  <div
    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-25"
    style={{ zIndex: 10 }}
  >
    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingOverlay;
