import { RootState } from '..';

export const selectCurrentUser = (state:RootState) => state.users.currentUser;
