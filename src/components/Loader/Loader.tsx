import React from 'react';
import './loader.scss';

export const Loader: React.FC = () => {
  return (
    <svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50" />
    </svg>
  );
};
