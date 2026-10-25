import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';
import ForgotPasswordModal from '../features/auth/ForgotPasswordModal';
import LoginPage from '../features/auth/LoginPage';
import SettingsPage from '../features/settings/SettingsPage';
import apiClient from '../api/client';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
  fetchCsrfToken: vi.fn().mockResolvedValue('test-csrf-token'),
}));

describe('FORGOT PASSWORD & OTP RESET WORKFLOW TESTS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      requestOtp: vi.fn(),
      resetPassword: vi.fn(),
      login: vi.fn(),
      user: null,
      updateUserLocal: vi.fn(),
    });
  });

  describe('1. ForgotPasswordModal Component Isolation', () => {
    it('should not render anything when isOpen is false', () => {
      const { container } = render(
        <ForgotPasswordModal
          isOpen={false}
          defaultEmail="dev@example.com"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render Step 1 with pre-filled email and send OTP button when isOpen is true', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        requestOtp: vi.fn(),
        resetPassword: vi.fn(),
      });

      render(
        <ForgotPasswordModal
          isOpen={true}
          defaultEmail="testdev@codefolio.dev"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );

      expect(screen.getByText(/Reset Account Password/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('testdev@codefolio.dev')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Send 6-Digit Verification Code/i })
      ).toBeInTheDocument();
    });

    it('should show error when submitting invalid email', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        requestOtp: vi.fn(),
        resetPassword: vi.fn(),
      });

      render(
        <ForgotPasswordModal
          isOpen={true}
          defaultEmail=""
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );

      const emailInput = screen.getByPlaceholderText('developer@domain.com');
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

      const submitBtn = screen.getByRole('button', {
        name: /Send 6-Digit Verification Code/i,
      });
      fireEvent.click(submitBtn);

      expect(
        screen.getByText(/Please provide a valid email address/i)
      ).toBeInTheDocument();
    });

    it('should request OTP and advance to Step 2 for OTP and new password input', async () => {
      const mockRequestOtp = vi.fn().mockResolvedValue({ success: true });
      const mockResetPassword = vi.fn().mockResolvedValue({ success: true, user: { id: 'u1' } });
      const mockOnSuccess = vi.fn();

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        requestOtp: mockRequestOtp,
        resetPassword: mockResetPassword,
      });

      render(
        <ForgotPasswordModal
          isOpen={true}
          defaultEmail="forgot@codefolio.dev"
          onClose={vi.fn()}
          onSuccess={mockOnSuccess}
        />
      );

      const submitBtn = screen.getByRole('button', {
        name: /Send 6-Digit Verification Code/i,
      });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockRequestOtp).toHaveBeenCalledWith('forgot@codefolio.dev');
      });

      // Step 2 elements are now visible
      await waitFor(() => {
        expect(screen.getByPlaceholderText('123456')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Repeat new password')).toBeInTheDocument();
      });

      // Enter OTP & mismatched passwords first
      fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '654321' } });
      fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), {
        target: { value: 'NewSuperPass123!' },
      });
      fireEvent.change(screen.getByPlaceholderText('Repeat new password'), {
        target: { value: 'DifferentPassword123!' },
      });

      const resetBtn = screen.getByRole('button', {
        name: /Verify OTP & Reset Password/i,
      });
      fireEvent.click(resetBtn);

      // Verify mismatch error
      expect(
        screen.getByText(/New password and confirmation password do not match/i)
      ).toBeInTheDocument();

      // Fix confirm password to match
      fireEvent.change(screen.getByPlaceholderText('Repeat new password'), {
        target: { value: 'NewSuperPass123!' },
      });
      fireEvent.click(resetBtn);

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith(
          'forgot@codefolio.dev',
          '654321',
          'NewSuperPass123!'
        );
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('2. LoginPage Integration with Forgot Password Flow', () => {
    it('should display "Forgot Password?" button and open modal on click', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        login: vi.fn(),
        requestOtp: vi.fn(),
        resetPassword: vi.fn(),
        user: null,
      });

      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );

      // Look for the "Forgot Password?" trigger button
      const forgotBtn = screen.getByRole('button', { name: /Forgot Password\?/i });
      expect(forgotBtn).toBeInTheDocument();

      // Enter email in login form first
      const emailInput = screen.getByPlaceholderText('developer@domain.com');
      fireEvent.change(emailInput, { target: { value: 'forgotuser@codefolio.dev' } });

      // Click Forgot Password
      fireEvent.click(forgotBtn);

      // Modal opens and pre-fills email
      expect(screen.getByText(/Reset Account Password/i)).toBeInTheDocument();
      expect(screen.getAllByDisplayValue('forgotuser@codefolio.dev').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('3. SettingsPage Integration with Forgot Password Flow', () => {
    it('should display "Forgot current password?" button in Security tab and open modal', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'securitydev', email: 'securitydev@codefolio.dev', isPro: false },
        updateUserLocal: vi.fn(),
        requestOtp: vi.fn(),
        resetPassword: vi.fn(),
      });

      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: { profile: { name: 'Security Dev' }, skills: {} },
          user: { username: 'securitydev', email: 'securitydev@codefolio.dev' },
        },
      });

      render(
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      );

      // Switch to Security Tab
      const securityTab = screen.getByRole('button', { name: /Security & Password/i });
      fireEvent.click(securityTab);

      // Look for "Forgot current password?" button
      const forgotCurrentBtn = screen.getByRole('button', { name: /Forgot current password\?/i });
      expect(forgotCurrentBtn).toBeInTheDocument();

      // Click it to open ForgotPasswordModal
      fireEvent.click(forgotCurrentBtn);

      expect(screen.getByText(/Reset Account Password/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('securitydev@codefolio.dev')).toBeInTheDocument();
    });
  });
});
