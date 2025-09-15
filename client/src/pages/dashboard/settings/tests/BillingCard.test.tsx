import { render, screen } from '@testing-library/react';
import BillingCard from '@/pages/dashboard/settings/components/BillingCard';

describe('BillingCard', () => {
  it('renders current plan and buttons', () => {
    render(<BillingCard />);
    expect(screen.getByText(/Current Plan/)).toBeInTheDocument();
    expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
    expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
  });
});
