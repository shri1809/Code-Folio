import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import OtpVerificationModal from '../features/auth/OtpVerificationModal';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ContactModal } from '../features/portfolio/ContactModal';
import { ShareModal } from '../components/ShareModal';
import Button from '../components/ui/Button';
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

describe('UI BUTTONS, INPUTS & COMPONENT WORKFLOW TESTS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. LOGIN PAGE INPUTS & BUTTONS
  describe('1. LoginPage Inputs, Password Visibility & Action Buttons', () => {
    it('should update email and password inputs and toggle password visibility', () => {
      const mockLogin = vi.fn().mockResolvedValue({ success: true, user: {} });
      const mockRequestOtp = vi.fn().mockResolvedValue({ success: true });

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        login: mockLogin,
        requestOtp: mockRequestOtp,
        user: null,
      });

      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText('developer@domain.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      // Test typing into inputs
      fireEvent.change(emailInput, { target: { value: 'testuser@codefolio.dev' } });
      fireEvent.change(passwordInput, { target: { value: 'SecretPass123!' } });

      expect(emailInput.value).toBe('testuser@codefolio.dev');
      expect(passwordInput.value).toBe('SecretPass123!');
      expect(passwordInput.type).toBe('password');

      // Test toggle password visibility button
      const toggleBtn = screen.getByLabelText(/show password/i);
      expect(toggleBtn).toBeInTheDocument();
      fireEvent.click(toggleBtn);
      expect(passwordInput.type).toBe('text');

      fireEvent.click(toggleBtn);
      expect(passwordInput.type).toBe('password');
    });

    it('should trigger login submission when Sign In button is clicked', async () => {
      const mockLogin = vi.fn().mockResolvedValue({ success: true, user: { username: 'testuser' } });
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        login: mockLogin,
        requestOtp: vi.fn(),
        user: null,
      });

      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('developer@domain.com'), {
        target: { value: 'testuser@codefolio.dev' },
      });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), {
        target: { value: 'Password123!' },
      });

      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('testuser@codefolio.dev', 'Password123!');
      });
    });

    it('should trigger passwordless OTP request when OTP button is clicked', async () => {
      const mockRequestOtp = vi.fn().mockResolvedValue({ success: true });
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        login: vi.fn(),
        requestOtp: mockRequestOtp,
        user: null,
      });

      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('developer@domain.com'), {
        target: { value: 'testuser@codefolio.dev' },
      });

      const otpBtn = screen.getByRole('button', { name: /passwordless/i });
      fireEvent.click(otpBtn);

      await waitFor(() => {
        expect(mockRequestOtp).toHaveBeenCalledWith('testuser@codefolio.dev');
      });
    });
  });

  // 2. REGISTER PAGE INPUTS, VALIDATION & BUTTONS
  describe('2. RegisterPage Inputs, Vanity URL Preview & Action Buttons', () => {
    it('should update vanity username input and show live URL preview', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        register: vi.fn(),
        user: null,
      });

      render(
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      );

      const usernameInput = screen.getByPlaceholderText('johndoe');
      fireEvent.change(usernameInput, { target: { value: 'johndev' } });

      expect(usernameInput.value).toBe('johndev');
      expect(screen.getByText(/codefolio.dev\/u\/johndev/i)).toBeInTheDocument();
    });

    it('should block reserved username without submitting to API', async () => {
      const mockRegister = vi.fn();
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        register: mockRegister,
        user: null,
      });

      render(
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('johndoe'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByPlaceholderText('john@example.com'), {
        target: { value: 'admin@codefolio.dev' },
      });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), {
        target: { value: 'Password123!' },
      });

      const submitBtn = screen.getByRole('button', { name: /register & send verification code/i });
      fireEvent.click(submitBtn);

      expect(
        screen.getByText(/The username 'admin' is reserved by the system/i)
      ).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should submit registration and open OTP modal on success', async () => {
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

      fireEvent.change(screen.getByPlaceholderText('johndoe'), { target: { value: 'newdev' } });
      fireEvent.change(screen.getByPlaceholderText('john@example.com'), {
        target: { value: 'newdev@codefolio.dev' },
      });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), {
        target: { value: 'Password123!' },
      });

      const submitBtn = screen.getByRole('button', { name: /register & send verification code/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('newdev', 'newdev@codefolio.dev', 'Password123!');
      });

      // Verify OTP modal opened
      await waitFor(() => {
        expect(screen.getByText(/Security Verification/i)).toBeInTheDocument();
      });
    });
  });

  // 3. OTP VERIFICATION MODAL INPUTS & BUTTONS
  describe('3. OtpVerificationModal 6-Digit Input & Buttons', () => {
    it('should enforce 6-digit numeric input and trigger verification', async () => {
      const mockVerifyOtp = vi.fn().mockResolvedValue({ success: true, user: {} });
      const mockRequestOtp = vi.fn().mockResolvedValue({ success: true });
      const mockOnClose = vi.fn();

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        verifyOtp: mockVerifyOtp,
        requestOtp: mockRequestOtp,
        user: null,
      });

      render(
        <MemoryRouter>
          <OtpVerificationModal
            isOpen={true}
            email="dev@codefolio.dev"
            onClose={mockOnClose}
          />
        </MemoryRouter>
      );

      const otpInput = screen.getByPlaceholderText('000000');
      const verifyBtn = screen.getByRole('button', { name: /verify & enter dashboard/i });

      // Button is disabled when less than 6 digits
      fireEvent.change(otpInput, { target: { value: '123' } });
      expect(verifyBtn).toBeDisabled();

      // Enter 6 digits
      fireEvent.change(otpInput, { target: { value: '654321' } });
      expect(otpInput.value).toBe('654321');
      expect(verifyBtn).not.toBeDisabled();

      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(mockVerifyOtp).toHaveBeenCalledWith('dev@codefolio.dev', '654321');
      });

      // Test Resend Code button
      const resendBtn = screen.getByRole('button', { name: /resend code/i });
      fireEvent.click(resendBtn);

      await waitFor(() => {
        expect(mockRequestOtp).toHaveBeenCalledWith('dev@codefolio.dev');
      });

      // Test Cancel button
      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelBtn);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // 4. DASHBOARD SPLIT-SCREEN BUILDER TABS, INPUTS & BUTTONS
  describe('4. DashboardPage Tabs, Form Inputs, Project Array & Save Button', () => {
    beforeEach(() => {
      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            profile: {
              name: 'John Developer',
              bio: 'Full-Stack Engineer',
              socialLinks: { github: 'https://github.com/john' },
            },
            skills: { frontend: ['React'], backend: ['Node.js'], devops: ['Docker'] },
            projects: [
              {
                title: 'Existing App',
                description: 'Existing description',
                techStack: ['React'],
                repoLink: 'https://github.com/app',
                liveLink: 'https://app.dev',
              },
            ],
          },
          user: {
            username: 'john',
            templateId: 'minimalist',
            isPro: true,
            customDomain: '',
          },
        },
      });

      apiClient.put.mockResolvedValue({
        data: {
          success: true,
          message: 'Portfolio changes securely saved!',
        },
      });
    });

    it('should switch between CMS tabs (Theme, Profile, Skills, Projects)', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'john', isPro: true, templateId: 'minimalist' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme/i)).toBeInTheDocument();
      });

      // Click Profile tab
      const profileTab = screen.getByRole('button', { name: /profile/i });
      fireEvent.click(profileTab);
      expect(screen.getByText(/Display Name/i)).toBeInTheDocument();

      // Click Skills tab
      const skillsTab = screen.getByRole('button', { name: /skills/i });
      fireEvent.click(skillsTab);
      expect(screen.getByText(/Frontend Skills/i)).toBeInTheDocument();

      // Click Projects tab
      const projectsTab = screen.getByRole('button', { name: /projects/i });
      fireEvent.click(projectsTab);
      expect(screen.getByText(/Project Showcase/i)).toBeInTheDocument();
    });

    it('should add a new project and submit portfolio updates via Save button', async () => {
      const mockUpdateUserLocal = vi.fn();
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'john', isPro: true, templateId: 'minimalist' },
        updateUserLocal: mockUpdateUserLocal,
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      // Wait for initial portfolio fetch to settle
      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme/i)).toBeInTheDocument();
      });

      // Go to Projects tab
      const projectsTab = screen.getByRole('button', { name: /projects/i });
      fireEvent.click(projectsTab);

      // Click "+ Add Project" button
      const addProjectBtn = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addProjectBtn);

      // Find project inputs and enter details
      const titleInputs = screen.getAllByPlaceholderText(/e\.g\. Distributed Task Queue/i);
      expect(titleInputs.length).toBeGreaterThanOrEqual(1);
      fireEvent.change(titleInputs[titleInputs.length - 1], {
        target: { value: 'Brand New Microservice' },
      });

      // Click Save Portfolio button
      const saveBtn = screen.getByRole('button', { name: /save portfolio/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(apiClient.put).toHaveBeenCalledWith(
          '/portfolio',
          expect.objectContaining({
            templateId: expect.any(String),
            profile: expect.any(Object),
            skills: expect.any(Object),
            projects: expect.any(Array),
          })
        );
      });
    });

    it('should toggle live preview device between Desktop and Mobile', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'john', isPro: false, templateId: 'minimalist' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTitle(/Desktop View/i)).toBeInTheDocument();
      });

      const mobileToggleBtn = screen.getByTitle(/Mobile View/i);
      fireEvent.click(mobileToggleBtn);

      const desktopToggleBtn = screen.getByTitle(/Desktop View/i);
      fireEvent.click(desktopToggleBtn);
    });
  });

  // 5. CONTACT MODAL INPUTS & SUBMIT BUTTON
  describe('5. ContactModal Inputs & Submission Button', () => {
    it('should fill visitor contact form and submit message relay', async () => {
      apiClient.post.mockResolvedValue({
        data: {
          success: true,
          message: 'Your message has been securely relayed to the developer.',
        },
      });

      const mockOnClose = vi.fn();

      render(
        <ContactModal
          isOpen={true}
          username="demo1"
          onClose={mockOnClose}
        />
      );

      // Fill in Contact Relay form
      const nameInput = screen.getByPlaceholderText('Jane Doe');
      const emailInput = screen.getByPlaceholderText('jane@company.com');
      const subjectInput = screen.getByPlaceholderText(/Collaboration or Engineering Opportunity/i);
      const messageInput = screen.getByPlaceholderText(/Hi, I saw your portfolio on CodeFolio and would love to connect regarding.../i);

      fireEvent.change(nameInput, { target: { value: 'Alice Visitor' } });
      fireEvent.change(emailInput, { target: { value: 'alice@company.com' } });
      fireEvent.change(subjectInput, { target: { value: 'Hiring Inquiry' } });
      fireEvent.change(messageInput, { target: { value: 'We would love to discuss a role!' } });

      expect(nameInput.value).toBe('Alice Visitor');
      expect(emailInput.value).toBe('alice@company.com');
      expect(subjectInput.value).toBe('Hiring Inquiry');
      expect(messageInput.value).toBe('We would love to discuss a role!');

      const sendBtn = screen.getByRole('button', { name: /send transmission/i });
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith(
          '/public/demo1/contact',
          expect.objectContaining({
            senderName: 'Alice Visitor',
            senderEmail: 'alice@company.com',
            subject: 'Hiring Inquiry',
            message: 'We would love to discuss a role!',
          })
        );
      });
    });
  });

  // 6. STANDARDIZED BUTTON COMPONENT VARIANTS, SIZES & STATES
  describe('6. Standardized Button Component Variants, Sizes, States & Accessibility', () => {
    it('should render primary, secondary, glass, ghost, and danger variants with standardized classes', () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons[0]).toHaveTextContent('Primary');
      expect(buttons[0]).toHaveClass('bg-gradient-to-r', 'from-[#0c1df2]');

      expect(buttons[1]).toHaveTextContent('Secondary');
      expect(buttons[1]).toHaveClass('bg-slate-800/90');

      expect(buttons[2]).toHaveTextContent('Glass');
      expect(buttons[2]).toHaveClass('backdrop-blur-md');

      expect(buttons[3]).toHaveTextContent('Ghost');
      expect(buttons[3]).toHaveClass('bg-transparent');

      expect(buttons[4]).toHaveTextContent('Danger');
      expect(buttons[4]).toHaveClass('bg-red-600/90');

      expect(buttons[5]).toHaveTextContent('Destructive');
      expect(buttons[5]).toHaveClass('bg-red-600/90');
    });

    it('should render standardized sizes (sm, md, lg, icon)', () => {
      const { container } = render(
        <div>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">Icon</Button>
        </div>
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons[0]).toHaveClass('h-8', 'px-3', 'text-xs');
      expect(buttons[1]).toHaveClass('h-10', 'px-4', 'text-sm');
      expect(buttons[2]).toHaveClass('h-11', 'px-6');
      expect(buttons[3]).toHaveClass('h-9', 'w-9', 'p-0');
    });

    it('should handle loading state, disable click, and render spinner', () => {
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Submit Action
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle disabled state correctly', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Action
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have accessible focus-visible ring styles and forward refs', () => {
      const testRef = React.createRef();
      render(<Button ref={testRef}>Accessible Button</Button>);

      const button = screen.getByRole('button');
      expect(testRef.current).toBe(button);
      expect(button).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-[#0c1df2]');
    });

    it('should include aria-busy when loading and aria-disabled when disabled on Button', () => {
      const { rerender } = render(<Button loading>Saving</Button>);
      const loadingButton = screen.getByRole('button');
      expect(loadingButton).toHaveAttribute('aria-busy', 'true');

      rerender(<Button disabled>Disabled Action</Button>);
      const disabledButton = screen.getByRole('button');
      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should handle Escape key dismissal on OtpVerificationModal, ShareModal, and ContactModal', () => {
      const mockCloseOtp = vi.fn();
      const mockCloseShare = vi.fn();
      const mockCloseContact = vi.fn();

      const { rerender } = render(
        <MemoryRouter>
          <OtpVerificationModal isOpen={true} email="test@codefolio.dev" onClose={mockCloseOtp} />
        </MemoryRouter>
      );
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockCloseOtp).toHaveBeenCalled();

      rerender(
        <ShareModal isOpen={true} onClose={mockCloseShare} username="testuser" />
      );
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockCloseShare).toHaveBeenCalled();

      rerender(
        <ContactModal isOpen={true} onClose={mockCloseContact} username="testuser" />
      );
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockCloseContact).toHaveBeenCalled();
    });

    it('should render dashboard tabs with accessible aria-pressed state', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'devtest', templateId: 'minimalist' },
        updateUserLocal: vi.fn(),
      });

      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            templateId: 'minimalist',
            profile: { name: 'Dev Test' },
            skills: {},
            projects: [],
          },
        },
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      // Verify individual Tab buttons and default selection
      const themeTab = screen.getByRole('button', { name: /theme & pro/i });
      const profileTab = screen.getByRole('button', { name: /^profile$/i });

      expect(themeTab).toHaveAttribute('aria-pressed', 'true');
      expect(profileTab).toHaveAttribute('aria-pressed', 'false');

      // Click profile tab
      fireEvent.click(profileTab);
      expect(profileTab).toHaveAttribute('aria-pressed', 'true');
      expect(themeTab).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
