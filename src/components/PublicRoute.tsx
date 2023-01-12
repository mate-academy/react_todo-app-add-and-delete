import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/auth/authSelectors';

type Props = {
  children: JSX.Element;
};

const PublicRoute:React.FC<Props> = ({ children }) => {
  const isAuthenticated:boolean | null = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
