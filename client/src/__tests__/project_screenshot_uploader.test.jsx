import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectScreenshotUploader } from '../components/ProjectScreenshotUploader';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('PROJECT SCREENSHOT DRAG & DROP AND DIRECT FILE UPLOADER TESTS', () => {
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
      screen.getByPlaceholderText(/images\.unsplash\.com/i)
    ).toBeInTheDocument();

    // 1-Click Presets
    expect(screen.getByRole('button', { name: /Mobile UI/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Web App/i })).toBeInTheDocument();
  });

  it('should trigger direct upload to /upload/screenshot when file is chosen via file picker', async () => {
    const mockOnChange = vi.fn();
    apiClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        url: '/api/uploads/65fa28974a6b1c1d88991234',
      },
    });

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

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/upload/screenshot',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
      expect(mockOnChange).toHaveBeenCalledWith('/api/uploads/65fa28974a6b1c1d88991234');
    });
  });

  it('should handle drag-and-drop lifecycle and drop image file directly uploading', async () => {
    const mockOnChange = vi.fn();
    apiClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        url: '/api/uploads/65fa28974a6b1c1d88995678',
      },
    });

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
    expect(screen.getByText(/Drop image here to upload!/i)).toBeInTheDocument();

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

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith('/api/uploads/65fa28974a6b1c1d88995678');
    });
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
      screen.getByText(/Please select a valid image file/i)
    ).toBeInTheDocument();
  });

  it('should display upload error if server rejects upload', async () => {
    const mockOnChange = vi.fn();
    apiClient.post.mockRejectedValueOnce({
      response: {
        data: {
          error: 'File size exceeds 5MB limit. Please choose a smaller image.',
        },
      },
    });

    render(
      <ProjectScreenshotUploader
        value=""
        onChange={mockOnChange}
        username="testdev"
        index={0}
      />
    );

    const fileInput = screen.getByTestId('file-input-0');
    const imageFile = new File(['mock image content'], 'huge.png', {
      type: 'image/png',
    });

    fireEvent.change(fileInput, { target: { files: [imageFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/File size exceeds 5MB limit/i)
      ).toBeInTheDocument();
    });
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
