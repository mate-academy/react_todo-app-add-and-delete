import React from 'react';
import { Oval } from 'react-loader-spinner';
import './Loader.scss';

export const Loader: React.FC = () => (
  <div className="Loader" data-cy="loader">
    <Oval
      height={40}
      width={40}
      color="#000"
      secondaryColor="#aaa"
    />
  </div>
);
