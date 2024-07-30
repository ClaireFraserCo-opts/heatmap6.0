// src/components/ErrorBoundary.jsx

import React, { Component } from 'react';

// Define a fallback UI component for better customization
const FallbackUI = ({ error, info, onRetry }) => (
  <div>
    <h1>Something went wrong.</h1>
    <p>{error.message}</p>
    <p>Additional details: {info.componentStack}</p>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>
);

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log the error to the console or an error reporting service
    console.error("Error caught in Error Boundary:", error, info);
    // Update state with error details for rendering in fallback UI
    this.setState({ error, info });
  }

  handleRetry = () => {
    // Optionally reset the error state and retry rendering
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI with error details and optional retry
      return <FallbackUI error={this.state.error} info={this.state.info} onRetry={this.handleRetry} />;
    }

    // Render children components as normal
    return this.props.children; 
  }
}

export default ErrorBoundary;
