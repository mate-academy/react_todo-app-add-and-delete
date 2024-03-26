import React from 'react';

type Props = {
  isLoading: boolean;
};
export const TodoItem: React.FC<Props> = ({ isLoading }) => {
  return (
    <div className="todo" data-cy="Todo">
      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter"></div>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};
