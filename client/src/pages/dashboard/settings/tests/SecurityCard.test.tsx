import { render, screen, fireEvent } from '@testing-library/react';
import SecurityCard from '@/pages/dashboard/settings/components/SecurityCard';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: jest.fn(),
    },
  },
}));

describe('SecurityCard', () => {
  it('renders password fields', () => {
    render(<SecurityCard />);
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', () => {
    render(<SecurityCard />);
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: '456' } });
    fireEvent.click(screen.getByText('Update Password'));
  });

  it('calls supabase.auth.updateUser on valid password change', async () => {
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });
    render(<SecurityCard />);
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Update Password'));
    expect(supabase.auth.updateUser).toHaveBeenCalled();
  });
});
