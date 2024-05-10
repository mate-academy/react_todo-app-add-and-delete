import React from 'react';

interface Props {
  loading: boolean;
}

export const Loader: React.FC<Props> = ({ loading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={`modal overlay ${loading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
