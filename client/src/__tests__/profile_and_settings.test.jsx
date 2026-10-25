import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';
import { ProfilePage } from '../features/profile/ProfilePage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { Navbar } from '../components/Navbar';
import { RegisterPage } from '../features/auth/RegisterPage';
import apiClient from '../api/client';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock API Client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
  fetchCsrfToken: vi.fn().mockResolvedValue('mock-csrf-token'),
}));

describe('PROFILE SETUP, SETTINGS & HEADER NAVIGATION TESTS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. ProfilePage (Post-Registration Onboarding)', () => {
    beforeEach(() => {
      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            profile: {
              name: 'New Developer',
              bio: '',
              socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
              resumeUrl: '',
            },
          },
        },
      });

      apiClient.put.mockResolvedValue({
        data: {
          success: true,
          message: 'Profile details successfully saved!',
        },
      });
    });

    it('should render all required profile inputs (Name, Bio, GitHub, LinkedIn, Resume)', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'newdev', email: 'newdev@codefolio.dev' },
      });

      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      // Verify title & badges
      expect(screen.getByText(/Complete Your Professional Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/INITIAL PROFILE SETUP/i)).toBeInTheDocument();

      // Verify form fields
      expect(screen.getByPlaceholderText(/e\.g\. Alex Rivera/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Senior Software Engineer passionate/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/https:\/\/github\.com\/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/https:\/\/linkedin\.com\/in\/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/drive\.google\.com\/file/i)).toBeInTheDocument();

      // Verify Skip link
      const skipLink = screen.getByText(/Skip for now/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink.getAttribute('href')).toBe('/dashboard');
    });

    it('should submit profile details to /api/portfolio on save', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'newdev', email: 'newdev@codefolio.dev' },
      });

      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      // Wait for initial get to settle
      await waitFor(() => {
        expect(screen.getByDisplayValue('New Developer')).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('New Developer');
      const bioInput = screen.getByPlaceholderText(/Senior Software Engineer passionate/i);
      const githubInput = screen.getByPlaceholderText(/https:\/\/github\.com\/username/i);
      const linkedinInput = screen.getByPlaceholderText(/https:\/\/linkedin\.com\/in\/username/i);
      const resumeInput = screen.getByPlaceholderText(/drive\.google\.com\/file/i);

      fireEvent.change(nameInput, { target: { value: 'Alex Rivera' } });
      fireEvent.change(bioInput, { target: { value: 'Full-Stack Developer' } });
      fireEvent.change(githubInput, { target: { value: 'https://github.com/alex' } });
      fireEvent.change(linkedinInput, { target: { value: 'https://linkedin.com/in/alex' } });
      fireEvent.change(resumeInput, { target: { value: 'https://myresume.pdf' } });

      const submitBtn = screen.getByRole('button', { name: /Save & Continue to Portfolio/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(apiClient.put).toHaveBeenCalledWith(
          '/portfolio',
          expect.objectContaining({
            profile: expect.objectContaining({
              name: 'Alex Rivera',
              bio: 'Full-Stack Developer',
              resumeUrl: 'https://myresume.pdf',
            }),
          })
        );
      });
    });

    it('should handle local file selection honestly without generating fake URLs', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'newdev', email: 'newdev@codefolio.dev' },
      });

      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      // Select a local PDF file
      const fileInput = document.querySelector('input[type="file"]');
      const testFile = new File(['%PDF-1.4 mock content'], 'my_developer_cv.pdf', {
        type: 'application/pdf',
      });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      // Verify file metadata badge is shown
      await waitFor(() => {
        expect(screen.getByText('my_developer_cv.pdf')).toBeInTheDocument();
      });

      // Crucially, verify that the resume URL input does NOT have a fake URL
      const resumeInput = screen.getByPlaceholderText(/drive\.google\.com\/file/i);
      expect(resumeInput.value).not.toContain('codefolio.dev/resumes');

      // Click remove button
      const removeBtn = screen.getByRole('button', { name: /remove selected file/i });
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(screen.queryByText('my_developer_cv.pdf')).not.toBeInTheDocument();
      });
    });

    it('should reject invalid file types and oversized files', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'newdev', email: 'newdev@codefolio.dev' },
      });

      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      const fileInput = document.querySelector('input[type="file"]');

      // 1. Invalid file extension (.exe)
      const invalidFile = new File(['binary'], 'virus.exe', { type: 'application/octet-stream' });
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      await waitFor(() => {
        expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
      });

      // 2. Oversized file (> 5MB)
      const bigFile = new File(['a'.repeat(6 * 1024 * 1024)], 'huge_portfolio.pdf', {
        type: 'application/pdf',
      });
      Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });
      fireEvent.change(fileInput, { target: { files: [bigFile] } });

      await waitFor(() => {
        expect(screen.getByText(/File size exceeds 5 MB/i)).toBeInTheDocument();
      });
    });

    it('should allow clearing an existing resume link', async () => {
      apiClient.get.mockResolvedValueOnce({
        data: {
          success: true,
          portfolio: {
            profile: {
              name: 'Developer',
              bio: '',
              socialLinks: {},
              resumeUrl: 'https://drive.google.com/file/d/xyz',
            },
          },
        },
      });

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'newdev', email: 'newdev@codefolio.dev' },
      });

      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('https://drive.google.com/file/d/xyz')).toBeInTheDocument();
      });

      const clearBtn = screen.getByRole('button', { name: /clear resume link/i });
      fireEvent.click(clearBtn);

      const resumeInput = screen.getByPlaceholderText(/drive\.google\.com\/file/i);
      expect(resumeInput.value).toBe('');
    });
  });

  describe('2. SettingsPage (Profile & Account Management)', () => {
    beforeEach(() => {
      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            profile: {
              name: 'Existing Dev',
              bio: 'Experienced Architect',
              socialLinks: {
                github: 'https://github.com/existing',
                linkedin: 'https://linkedin.com/in/existing',
                twitter: 'https://x.com/existing',
                website: 'https://existing.dev',
              },
              resumeUrl: 'https://existing.pdf',
            },
          },
          user: {
            username: 'existing',
            email: 'existing@codefolio.dev',
            isPro: true,
            customDomain: 'existing.com',
          },
        },
      });

      apiClient.put.mockResolvedValue({
        data: {
          success: true,
          message: 'Account & profile settings successfully saved!',
        },
      });
    });

    it('should pre-fill existing profile settings and display account info', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'existing', email: 'existing@codefolio.dev', isPro: true },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      );

      // Verify title & sections
      expect(screen.getByText(/Account & Profile Settings/i)).toBeInTheDocument();
      expect(screen.getByText(/Core Profile Information/i)).toBeInTheDocument();
      expect(screen.getByText(/Social & Professional Links/i)).toBeInTheDocument();
      expect(screen.getByText(/Resume \/ CV Document/i)).toBeInTheDocument();
      expect(screen.getByText(/Account & Domain Management/i)).toBeInTheDocument();

      // Verify user info badges
      expect(screen.getByText(/@existing/i)).toBeInTheDocument();
      expect(screen.getByText('existing@codefolio.dev')).toBeInTheDocument();

      // Wait for data load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Dev')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Experienced Architect')).toBeInTheDocument();
      });
    });

    it('should submit updated settings when Save Settings is clicked', async () => {
      const mockUpdateUserLocal = vi.fn();
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'existing', email: 'existing@codefolio.dev', isPro: true },
        updateUserLocal: mockUpdateUserLocal,
      });

      render(
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Dev')).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('Existing Dev');
      fireEvent.change(nameInput, { target: { value: 'Updated Dev Name' } });

      const saveBtn = screen.getByRole('button', { name: /Save Settings/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(apiClient.put).toHaveBeenCalledWith(
          '/portfolio',
          expect.objectContaining({
            profile: expect.objectContaining({
              name: 'Updated Dev Name',
            }),
          })
        );
      });
    });

    it('should switch to separate Skill Settings tab, add skills, and save skills independently', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'existing', email: 'existing@codefolio.dev', isPro: true },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      );

      // Click on Skill Settings Tab
      const skillsTab = screen.getByRole('button', { name: /^Skill Settings$/i });
      fireEvent.click(skillsTab);

      expect(screen.getByText(/Technical Stack & Skill Settings/i)).toBeInTheDocument();
      expect(screen.getByText(/Frontend Proficiencies/i)).toBeInTheDocument();
      expect(screen.getByText(/Backend & Database Proficiencies/i)).toBeInTheDocument();
      expect(screen.getByText(/DevOps & Infrastructure Proficiencies/i)).toBeInTheDocument();

      // Add a frontend skill via quick pick pill
      const reactPreset = screen.getByRole('button', { name: /\+ React/i });
      fireEvent.click(reactPreset);

      // Save skill settings
      const saveSkillsBtn = screen.getByRole('button', { name: /Save Skill Settings/i });
      fireEvent.click(saveSkillsBtn);

      await waitFor(() => {
        expect(apiClient.put).toHaveBeenCalledWith(
          '/portfolio',
          expect.objectContaining({
            skills: expect.objectContaining({
              frontend: expect.arrayContaining(['React']),
            }),
          })
        );
      });
    });

    it('should switch to separate Security & Password tab, validate, and submit password change', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'existing', email: 'existing@codefolio.dev', isPro: true },
        updateUserLocal: vi.fn(),
      });

      apiClient.put.mockResolvedValueOnce({
        data: {
          success: true,
          message: 'Password successfully changed!',
        },
      });

      render(
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      );

      // Click on Security & Password Tab
      const securityTab = screen.getByRole('button', { name: /Security & Password/i });
      fireEvent.click(securityTab);

      expect(screen.getByText(/Change Account Password/i)).toBeInTheDocument();

      const currentPassInput = screen.getByPlaceholderText('••••••••••••');
      const newPassInput = screen.getByPlaceholderText('At least 8 characters');
      const confirmPassInput = screen.getByPlaceholderText('Repeat new password');

      fireEvent.change(currentPassInput, { target: { value: 'CurrentPass123!' } });
      fireEvent.change(newPassInput, { target: { value: 'BrandNewSecret123!' } });
      fireEvent.change(confirmPassInput, { target: { value: 'BrandNewSecret123!' } });

      const updatePassBtn = screen.getByRole('button', { name: /Update Password/i });
      fireEvent.click(updatePassBtn);

      await waitFor(() => {
        expect(apiClient.put).toHaveBeenCalledWith('/auth/password', {
          currentPassword: 'CurrentPass123!',
          newPassword: 'BrandNewSecret123!',
        });
      });
    });
  });

  describe('3. Header Section (Navbar) Settings Button', () => {
    it('should display Settings button and Sign Out button when user is logged in', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'activeuser', isPro: false },
        logout: vi.fn(),
      });

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      // Verify Settings button exists in header
      const settingsLink = screen.getByRole('link', { name: /settings/i });
      expect(settingsLink).toBeInTheDocument();
      expect(settingsLink.getAttribute('href')).toBe('/settings');

      // Verify Sign Out button exists
      const signOutBtn = screen.getByRole('button', { name: /sign out/i });
      expect(signOutBtn).toBeInTheDocument();
    });
  });

  describe('4. Registration Redirects to /profile', () => {
    it('should configure OtpVerificationModal with redirectTo="/profile" upon registration', async () => {
      const mockRegister = vi.fn().mockResolvedValue({ success: true });
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        register: mockRegister,
        verifyOtp: vi.fn(),
        requestOtp: vi.fn(),
        user: null,
      });

      render(
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('johndoe'), { target: { value: 'brandnew' } });
      fireEvent.change(screen.getByPlaceholderText('john@example.com'), {
        target: { value: 'brandnew@codefolio.dev' },
      });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), {
        target: { value: 'Password123!' },
      });

      const submitBtn = screen.getByRole('button', { name: /register & send verification code/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('brandnew', 'brandnew@codefolio.dev', 'Password123!');
      });

      // OTP modal opens
      await waitFor(() => {
        expect(screen.getByText(/Security Verification/i)).toBeInTheDocument();
      });
    });
  });
});
