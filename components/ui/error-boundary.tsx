"use client";

import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Short label for the section shown in the fallback message. */
  sectionName?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Catches render errors in homepage data sections so a single failing
 * widget cannot white-screen the whole page. Renders a quiet fallback
 * instead of crashing.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error(
      `[error-boundary] ${this.props.sectionName ?? "section"} crashed:`,
      error.message,
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-sm text-muted">
              {this.props.sectionName
                ? `${this.props.sectionName} unavailable.`
                : "Metrics unavailable."}
            </p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
