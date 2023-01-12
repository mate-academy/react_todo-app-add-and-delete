import { RootState } from '..';

export const selectIsAuthenticated = (state:RootState) => (
  state.auth.isAuthenticated
);
