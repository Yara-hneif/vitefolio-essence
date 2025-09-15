import { render, screen } from '@testing-library/react';
import DataCard from '@/pages/dashboard/settings/components/DataCard';

describe('DataCard', () => {
  it('renders data management buttons', () => {
    render(<DataCard />);
    expect(screen.getByText('Export My Data')).toBeInTheDocument();
    expect(screen.getByText('Clear Activity History')).toBeInTheDocument();
  });
});
