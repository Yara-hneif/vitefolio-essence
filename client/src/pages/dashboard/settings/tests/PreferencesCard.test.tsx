import { render, screen, fireEvent } from '@testing-library/react';
import PreferencesCard from '@/pages/dashboard/settings/components/PreferencesCard';

describe('PreferencesCard', () => {
  it('renders switches and save button', () => {
    render(<PreferencesCard />);
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();
  });

  it('toggles switches', () => {
    render(<PreferencesCard />);
    const darkModeSwitch = screen.getByLabelText('Dark Mode');
    fireEvent.click(darkModeSwitch);
  });
});
