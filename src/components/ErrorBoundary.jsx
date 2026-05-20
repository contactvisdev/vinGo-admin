import { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="m-4 shadow-sm border-danger">
          <Card.Body className="text-center py-5">
            <h4 className="text-danger mb-3">Something went wrong</h4>
            <p className="text-muted mb-4">An unexpected error occurred. Please try again.</p>
            <Button variant="primary" onClick={() => this.handleReset()}>
              Try Again
            </Button>
          </Card.Body>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
