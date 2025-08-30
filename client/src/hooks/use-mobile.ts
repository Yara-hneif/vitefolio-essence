import { useMediaQuery } from 'usehooks-ts';

export const MOBILE_QUERY = '(max-width: 767.98px)';

export function useIsMobile() {
  // initializeWithValue:false avoids SSR hydration mismatch
  return useMediaQuery(MOBILE_QUERY, { initializeWithValue: false });
}
