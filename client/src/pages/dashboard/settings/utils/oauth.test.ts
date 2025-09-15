import { signInWithOAuth } from './oauth';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
    },
  },
}));

describe('signInWithOAuth', () => {
  const originalAlert = window.alert;
  beforeAll(() => {
    window.alert = jest.fn(); // mock alert
  });

  afterAll(() => {
    window.alert = originalAlert;
  });

  it('calls supabase.auth.signInWithOAuth with the correct provider', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({ error: null });

    await signInWithOAuth('github');

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
  });

  it('shows an alert if there is an error', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      error: { message: 'Something went wrong' },
    });

    await signInWithOAuth('linkedin');

    expect(window.alert).toHaveBeenCalledWith('OAuth error: Something went wrong');
  });
});
