import { Month, Occasion, OccasionType } from '@occasions/types';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import { render } from '../../test/utils';
import useGetOccasion from './hooks/use-get-occasion';
import Occassions from './index';

// Mock Clerk - return children directly to avoid React version mismatch
vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(),
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('./hooks/use-get-occasion');

vi.mock('../profile', () => ({
  default: () => null,
}));


import { useAuth } from '@clerk/clerk-react';

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
const mockUseGetOccasion = useGetOccasion as ReturnType<typeof vi.fn>;

describe('Occassions Page', () => {
  const mockUserId = 'user-123';
  const firstName = 'Sri Yukteswar';
  const secondName = 'Jane Smith';
  const thirdName = 'Anandamoyi Ma';
  const mockOccasions: Occasion[] = [
    {
      id: '1',
      userId: mockUserId,
      name: firstName,
      occasionType: OccasionType.BIRTHDAY,
      month: Month.JANUARY,
      day: 15,
    },
    {
      id: '2',
      userId: mockUserId,
      name: secondName,
      occasionType: OccasionType.ANNIVERSARY,
      month: Month.MARCH,
      day: 20,
    },
    {
      id: '3',
      userId: mockUserId,
      name: thirdName,
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

      
      const table = screen.getByTestId('occasions-table');
      const tbody = table.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
      
      const rows = tbody?.querySelectorAll('tr');
      expect(rows).toHaveLength(3);

      expect(screen.getByText(firstName)).toBeInTheDocument();
      expect(screen.getByText(secondName)).toBeInTheDocument();
      expect(screen.getByText(thirdName)).toBeInTheDocument();
    });

    it.skip('should render Profile component', async () => {
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

      let table = screen.getByTestId('occasions-table');
      let tbody = table.querySelector('tbody');
      let rows = tbody?.querySelectorAll('tr');
      expect(rows).toHaveLength(3);
      expect(screen.getByText(firstName)).toBeInTheDocument();
      expect(screen.getByText(secondName)).toBeInTheDocument();
      expect(screen.getByText(thirdName)).toBeInTheDocument();

      // Filter by January
      const monthSelect = screen.getByPlaceholderText('search by month..');
      await user.click(monthSelect);

      const januaryOption = await screen.findByRole('option', { name: Month.JANUARY });
      await user.click(januaryOption);

      await waitFor(() => {
        table = screen.getByTestId('occasions-table');
        tbody = table.querySelector('tbody');
        rows = tbody?.querySelectorAll('tr');
       
        expect(rows).toHaveLength(2);
        expect(screen.getByText(firstName)).toBeInTheDocument();
        
        expect(screen.getByText(thirdName)).toBeInTheDocument();
        expect(screen.queryByText(secondName)).not.toBeInTheDocument();
      });
    });

    it('should filter occasions by name', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('search by name..');
      await user.type(nameInput, 'Sri');

      await waitFor(() => {
        const table = screen.getByTestId('occasions-table');
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');
        expect(rows).toHaveLength(1);
        expect(screen.getByText(firstName)).toBeInTheDocument();

        expect(screen.queryByText(secondName)).not.toBeInTheDocument();
        expect(screen.queryByText(thirdName)).not.toBeInTheDocument();
      });
    });

    it('should filter occasions by both month and name', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      // Filter by January - Mantine Select needs special handling
      const monthSelect = screen.getByPlaceholderText('search by month..');
      await user.click(monthSelect);

      const januaryOption = await screen.findByRole('option', { name: Month.JANUARY });
      await user.click(januaryOption);

      await waitFor(() => {
        const table = screen.getByTestId('occasions-table');
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');

        expect(rows).toHaveLength(2);
      });

      // Then filter by name (Sri)
      const nameInput = screen.getByPlaceholderText('search by name..');
      await user.type(nameInput, 'Sri');

      await waitFor(() => {
      
        const table = screen.getByTestId('occasions-table');
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');
        
        expect(rows).toHaveLength(1);
        expect(screen.getByText(firstName)).toBeInTheDocument();
      
        expect(screen.queryByText(secondName)).not.toBeInTheDocument();
        expect(screen.queryByText(thirdName)).not.toBeInTheDocument();
      });
    });

    it('should clear filters and show all occasions', async () => {
      const user = userEvent.setup();
      render(<Occassions />);

      await waitFor(() => {
        expect(screen.getByTestId('occasions-table')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('search by name..');
      await user.type(nameInput, 'Sri');

      await waitFor(() => {
        const table = screen.getByTestId('occasions-table');
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');
       
        expect(rows).toHaveLength(1);
       
        expect(screen.queryByText(secondName)).not.toBeInTheDocument();
      });

      await user.clear(nameInput);

      await waitFor(() => {
        const table = screen.getByTestId('occasions-table');
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');
        
        expect(rows).toHaveLength(3);
        expect(screen.getByText(firstName)).toBeInTheDocument();
        expect(screen.getByText(secondName)).toBeInTheDocument();
        expect(screen.getByText(thirdName)).toBeInTheDocument();
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

    it.skip('should open add occasion dialog when Add button is clicked', async () => {
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

    it.skip('should close add occasion dialog when close is clicked', async () => {
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
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');
        expect(rows).toHaveLength(3);

        const firstRow = rows?.[0];
        const secondRow = rows?.[1];
        const thirdRow = rows?.[2];
        expect(firstRow).toHaveTextContent('January Occasion');
        expect(secondRow).toHaveTextContent('February Occasion');
        expect(thirdRow).toHaveTextContent('March Occasion');
      });
    });
  });
});

