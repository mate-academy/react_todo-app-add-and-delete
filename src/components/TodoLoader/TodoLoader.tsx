import React, { memo } from 'react';

export const TodoLoader: React.FC = memo(() => {
  return (
    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
});
