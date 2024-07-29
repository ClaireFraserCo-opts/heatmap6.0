// src/components/ErrorBoundary.jsx

import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service
    console.error("Error caught in Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI can be customized here
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
