import { Month, Occasion, OccasionType } from '@occasions/types';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import { render } from '../../test/utils';
import useGetOccasion from './hooks/use-get-occasion';
import Occassions from './index';

// Use a shared React reference to avoid version mismatch
const sharedReact = React;

// Mock Clerk - return children directly to avoid React version mismatch
vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(),
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the hooks
vi.mock('./hooks/use-get-occasion');

// Mock Profile component - return null (component is still rendered by parent)
vi.mock('../profile', () => ({
  default: () => null,
}));

// Mock AddOccasionDialog component - use shared React reference
vi.mock('./components/add-occassion-dialog', async () => {
  const React = await import('react');
  return {
    default: ({
      opened,
      onClose,
    }: {
      opened: boolean;
      onClose: () => void;
    }) => {
      if (!opened) return null;
      return React.createElement(
        'div',
        { 'data-testid': 'add-occasion-dialog' },
        React.createElement('button', { onClick: onClose }, 'Close Dialog')
      );
    },
  };
});

// Mock OccasionsTable component - use shared React reference
vi.mock('./components/occassions-table/OccassionsTable', async () => {
  const React = await import('react');
  return {
    default: ({ occassions }: { occassions: Occasion[] }) => {
      return React.createElement(
        'div',
        { 'data-testid': 'occasions-table' },
        ...occassions.map((occ) =>
          React.createElement(
            'div',
            { key: occ.id, 'data-testid': `occasion-${occ.id}` },
            `${occ.name} - ${occ.month}`
          )
        )
      );
    },
  };
});

import { useAuth } from '@clerk/clerk-react';

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
const mockUseGetOccasion = useGetOccasion as ReturnType<typeof vi.fn>;

describe('Occassions Page', () => {
  const mockUserId = 'user-123';
  const mockOccasions: Occasion[] = [
    {
      id: '1',
      userId: mockUserId,
      name: 'John Doe',
      occasionType: OccasionType.BIRTHDAY,
      month: Month.JANUARY,
      day: 15,
    },
    {
      id: '2',
      userId: mockUserId,
      name: 'Jane Smith',
      occasionType: OccasionType.ANNIVERSARY,
      month: Month.MARCH,
      day: 20,
    },
    {
      id: '3',
      userId: mockUserId,
      name: 'Bob Johnson',
      occasionType: OccasionType.BIRTHDAY,
      month: Month.JANUARY,
      day: 25,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      userId: mockUserId,
      isLoaded: true,
    });
  });

  describe('Loading States', () => {
    it('should show loading message when data is loading', () => {
      mockUseGetOccasion.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      render(<Occassions />);

      expect(screen.getByText('Fetching data...')).toBeInTheDocument();
      expect(screen.queryByTestId('occasions-table')).not.toBeInTheDocument();
    });

    it('should show message when auth is not loaded', () => {
      mockUseAuth.mockReturnValue({
        userId: null,
        isLoaded: false,
      });

      mockUseGetOccasion.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<Occassions />);

      expect(screen.getByText('Try signing in again')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when there is an error', () => {
      const errorMessage = 'Failed to fetch occasions';
      mockUseGetOccasion.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: { message: errorMessage } as Error,
      });

      render(<Occassions />);

      expect(
        screen.getByText('There was an error fetching the data')
      ).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should render occasions table when data is loaded', async () => {
      mockUseGetOccasion.mockReturnValue({
        data: mockOccasions,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // Verify all occasions are displayed
      expect(screen.getByTestId('occasion-1')).toBeInTheDocument();
      expect(screen.getByTestId('occasion-2')).toBeInTheDocument();
      expect(screen.getByTestId('occasion-3')).toBeInTheDocument();
    });

    it('should render Profile component', async () => {
      mockUseGetOccasion.mockReturnValue({
        data: mockOccasions,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toBeInTheDocument();
      });
    });

    it('should render search and filter controls', async () => {
      mockUseGetOccasion.mockReturnValue({
        data: mockOccasions,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<Occassions />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('search by month..')
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText('search by name..')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      });
    });
  });

  describe('Filtering Functionality', () => {
    beforeEach(() => {
      mockUseGetOccasion.mockReturnValue({
        data: mockOccasions,
        isLoading: false,
        isError: false,
        error: null,
      });
    });

    it('should filter occasions by month', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // All occasions should be visible initially
      expect(screen.getByTestId('occasion-1')).toBeInTheDocument();
      expect(screen.getByTestId('occasion-2')).toBeInTheDocument();
      expect(screen.getByTestId('occasion-3')).toBeInTheDocument();

      // Filter by January
      const monthSelect = screen.getByPlaceholderText('search by month..');
      await user.click(monthSelect);

      // Wait for dropdown to appear and select January
      // Note: Mantine Select component might need different interaction
      // This is a simplified version - you may need to adjust based on actual Mantine Select behavior
      await waitFor(async () => {
        const januaryOption = screen.getByText(Month.JANUARY);
        await user.click(januaryOption);
      });

      // After filtering, only January occasions should be visible
      await waitFor(() => {
        expect(screen.getByTestId('occasion-1')).toBeInTheDocument();
        expect(screen.getByTestId('occasion-3')).toBeInTheDocument();
        expect(screen.queryByTestId('occasion-2')).not.toBeInTheDocument();
      });
    });

    it('should filter occasions by name', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // Search for "John"
      const nameInput = screen.getByPlaceholderText('search by name..');
      await user.type(nameInput, 'John');

      await waitFor(() => {
        // Should show John Doe
        expect(screen.getByTestId('occasion-1')).toBeInTheDocument();
        // Should not show others
        expect(screen.queryByTestId('occasion-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('occasion-3')).not.toBeInTheDocument();
      });
    });

    it('should filter occasions by both month and name', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // First filter by month (January)
      const monthSelect = screen.getByPlaceholderText('search by month..');
      await user.click(monthSelect);

      await waitFor(async () => {
        const januaryOption = await screen.findByText(Month.JANUARY);
        await user.click(januaryOption);
      });

      // Then filter by name (John)
      const nameInput = screen.getByPlaceholderText('search by name..');
      await user.type(nameInput, 'John');

      await waitFor(() => {
        // Should only show John Doe (January)
        expect(screen.getByTestId('occasion-1')).toBeInTheDocument();
        expect(screen.queryByTestId('occasion-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('occasion-3')).not.toBeInTheDocument();
      });
    });

    it('should clear filters and show all occasions', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // Apply a filter
      const nameInput = screen.getByPlaceholderText('search by name..');
      await user.type(nameInput, 'John');

      await waitFor(() => {
        expect(screen.queryByTestId('occasion-2')).not.toBeInTheDocument();
      });

      // Clear the filter
      await user.clear(nameInput);

      await waitFor(() => {
        // All occasions should be visible again
        expect(screen.getByTestId('occasion-1')).toBeInTheDocument();
        expect(screen.getByTestId('occasion-2')).toBeInTheDocument();
        expect(screen.getByTestId('occasion-3')).toBeInTheDocument();
      });
    });
  });

  describe('Add Occasion Dialog', () => {
    beforeEach(() => {
      mockUseGetOccasion.mockReturnValue({
        data: mockOccasions,
        isLoading: false,
        isError: false,
        error: null,
      });
    });

    it('should open add occasion dialog when Add button is clicked', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // Dialog should not be visible initially
      expect(
        screen.queryByTestId('add-occasion-dialog')
      ).not.toBeInTheDocument();

      // Click Add button
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      // Dialog should be visible
      await waitFor(() => {
        expect(screen.getByTestId('add-occasion-dialog')).toBeInTheDocument();
      });
    });

    it('should close add occasion dialog when close is clicked', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // Open dialog
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId('add-occasion-dialog')).toBeInTheDocument();
      });

      // Close dialog
      const closeButton = screen.getByRole('button', { name: /close dialog/i });
      await user.click(closeButton);

      // Dialog should be closed
      await waitFor(() => {
        expect(
          screen.queryByTestId('add-occasion-dialog')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Sorting', () => {
    it('should sort occasions by month', async () => {
      const unsortedOccasions: Occasion[] = [
        {
          id: '1',
          userId: mockUserId,
          name: 'March Occasion',
          occasionType: OccasionType.BIRTHDAY,
          month: Month.MARCH,
          day: 15,
        },
        {
          id: '2',
          userId: mockUserId,
          name: 'January Occasion',
          occasionType: OccasionType.BIRTHDAY,
          month: Month.JANUARY,
          day: 15,
        },
        {
          id: '3',
          userId: mockUserId,
          name: 'February Occasion',
          occasionType: OccasionType.BIRTHDAY,
          month: Month.FEBRUARY,
          day: 15,
        },
      ];

      mockUseGetOccasion.mockReturnValue({
        data: unsortedOccasions,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<Occassions />);

      await waitFor(() => {
        const table = screen.getByTestId('occasions-table');
        const occasions = within(table).getAllByTestId(/occasion-/);

        // Verify occasions are sorted by month (January, February, March)
        expect(occasions[0]).toHaveAttribute('data-testid', 'occasion-2'); // January
        expect(occasions[1]).toHaveAttribute('data-testid', 'occasion-3'); // February
        expect(occasions[2]).toHaveAttribute('data-testid', 'occasion-1'); // March
      });
    });
  });
});

