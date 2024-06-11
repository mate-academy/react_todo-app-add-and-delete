import React from 'react';
import './Loader.scss';

export const Loader: React.FC = () => (
  <div className="loader" data-cy="loader">
    <div className="loader__content" />
  </div>
);
