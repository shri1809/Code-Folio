import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectScreenshotUploader } from '../components/ProjectScreenshotUploader';

describe('PROJECT SCREENSHOT DRAG & DROP AND FILE UPLOADER TESTS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render drag-and-drop zone, file upload button, URL input and presets', () => {
    const mockOnChange = vi.fn();
    render(
      <ProjectScreenshotUploader
        value=""
        onChange={mockOnChange}
        username="testdev"
        index={0}
      />
    );

    // Label & Drag-and-drop zone
    expect(screen.getByText(/Project Screenshot/i)).toBeInTheDocument();
    expect(screen.getByTestId('dropzone-0')).toBeInTheDocument();
    expect(screen.getByText(/Browse File/i)).toBeInTheDocument();

    // URL input
    expect(
      screen.getByPlaceholderText(/https:\/\/images\.unsplash\.com/i)
    ).toBeInTheDocument();

    // 1-Click Presets
    expect(screen.getByRole('button', { name: /Mobile UI/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Web App/i })).toBeInTheDocument();
  });

  it('should trigger upload when file is chosen via file picker (like resume)', () => {
    const mockOnChange = vi.fn();
    render(
      <ProjectScreenshotUploader
        value=""
        onChange={mockOnChange}
        username="testdev"
        index={0}
      />
    );

    const fileInput = screen.getByTestId('file-input-0');
    const imageFile = new File(['mock image content'], 'my-app-screen.png', {
      type: 'image/png',
    });

    fireEvent.change(fileInput, { target: { files: [imageFile] } });

    expect(mockOnChange).toHaveBeenCalled();
    const calledUrl = mockOnChange.mock.calls[0][0];
    expect(calledUrl).toContain('codefolio.dev/uploads/testdev');
    expect(calledUrl).toContain('my-app-screen.png');
  });

  it('should handle drag-and-drop lifecycle and drop image file', () => {
    const mockOnChange = vi.fn();
    render(
      <ProjectScreenshotUploader
        value=""
        onChange={mockOnChange}
        username="testdev"
        index={0}
      />
    );

    const dropzone = screen.getByTestId('dropzone-0');

    // Drag Over
    fireEvent.dragOver(dropzone);
    expect(screen.getByText(/Drop image here!/i)).toBeInTheDocument();

    // Drag Leave
    fireEvent.dragLeave(dropzone);
    expect(screen.getByTestId('dropzone-0')).toBeInTheDocument();

    // Drop Image File
    const imageFile = new File(['mock content'], 'dropped-preview.webp', {
      type: 'image/webp',
    });
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [imageFile],
      },
    });

    expect(mockOnChange).toHaveBeenCalled();
    const calledUrl = mockOnChange.mock.calls[0][0];
    expect(calledUrl).toContain('dropped-preview.webp');
  });

  it('should show error when non-image file is dropped', () => {
    const mockOnChange = vi.fn();
    render(
      <ProjectScreenshotUploader
        value=""
        onChange={mockOnChange}
        username="testdev"
        index={0}
      />
    );

    const dropzone = screen.getByTestId('dropzone-0');
    const textFile = new File(['not an image'], 'notes.txt', {
      type: 'text/plain',
    });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [textFile],
      },
    });

    expect(mockOnChange).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Please upload a valid image file/i)
    ).toBeInTheDocument();
  });

  it('should update screenshot when 1-click preset button is clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <ProjectScreenshotUploader
        value=""
        onChange={mockOnChange}
        username="testdev"
        index={0}
      />
    );

    const analyticsPreset = screen.getByRole('button', { name: /Analytics/i });
    fireEvent.click(analyticsPreset);

    expect(mockOnChange).toHaveBeenCalled();
    const calledUrl = mockOnChange.mock.calls[0][0];
    expect(calledUrl).toContain('images.unsplash.com');
  });

  it('should display preview and allow clearing screenshot', () => {
    const mockOnChange = vi.fn();
    render(
      <ProjectScreenshotUploader
        value="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
        onChange={mockOnChange}
        username="testdev"
        index={0}
      />
    );

    // Preview should exist
    expect(screen.getByAltText(/Project screenshot/i)).toBeInTheDocument();

    // Clear button
    const clearBtn = screen.getByTitle(/Remove Screenshot/i);
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });
});
