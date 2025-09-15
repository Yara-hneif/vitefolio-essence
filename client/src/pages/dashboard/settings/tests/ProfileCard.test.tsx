import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileCard from '@/pages/dashboard/settings/components/ProfileCard';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn(),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: 'https://fake-url.com/avatar.png' },
        })),
      })),
    },
  },
}));

const mockProfile = {
  id: '1',
  name: 'Yara',
  username: 'yara123',
  email: 'yara@example.com',
  phone: '0500000000',
  bio: 'Software Engineer',
  github: 'https://github.com/yara',
  linkedin: 'https://linkedin.com/in/yara',
  website: 'https://yara.dev',
  avatar: null,
};

describe('ProfileCard', () => {
  let setProfile: jest.Mock;
  let handleAvatarChange: jest.Mock;

  beforeEach(() => {
    setProfile = jest.fn();
    handleAvatarChange = jest.fn();
  });

  it('renders profile information', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        setProfile={setProfile}
        handleAvatarChange={handleAvatarChange}
      />
    );
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Yara');
    expect(screen.getByLabelText('Email')).toHaveValue('yara@example.com');
  });

  it('enables editing and saving profile', async () => {
    const updateMock = jest.fn().mockResolvedValue({ error: null });
    (supabase.from as jest.Mock).mockReturnValue({ update: updateMock, eq: jest.fn() });

    render(
      <ProfileCard
        profile={mockProfile}
        setProfile={setProfile}
        handleAvatarChange={handleAvatarChange}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
    });
  });

  it('shows No Avatar when avatar is missing', () => {
    render(
      <ProfileCard
        profile={{ ...mockProfile, avatar: null }}
        setProfile={setProfile}
        handleAvatarChange={handleAvatarChange}
      />
    );
    expect(screen.getByText('No Avatar')).toBeInTheDocument();
  });
});
