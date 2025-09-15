import { render, screen } from '@testing-library/react';
import DangerCard from '@/pages/dashboard/settings/components/DangerCard';

describe('DangerCard', () => {
  it('renders danger zone actions', () => {
    render(<DangerCard />);
    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
    expect(screen.getByText('Deactivate Account')).toBeInTheDocument();
  });
});
