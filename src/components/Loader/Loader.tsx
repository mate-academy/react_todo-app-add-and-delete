import React from 'react';
import './Loader.scss';

export const Loader: React.FC = () => (
  <div data-cy="TodoLoader" className="modal overlay is-active">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
