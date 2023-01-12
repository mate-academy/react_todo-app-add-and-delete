import { FC, useEffect } from 'react';
import { GlobalLoader } from '../components/Loader';
import UserMenu from '../components/UserMenu';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import AuthAsync from '../store/auth/authAsync';
import { selectIsAuthenticated } from '../store/auth/authSelectors';
import AppRouting from './AppRouting';

const App:FC = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(AuthAsync.checkAuthenticated());
  }, []);

  if (isAuthenticated === null) {
    return <GlobalLoader />;
  }

  return (
    <>
      <AppRouting />
      <UserMenu />
    </>
  );
};

export default App;
