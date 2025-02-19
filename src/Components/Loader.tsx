import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  loading: boolean;
  requestMethod: 'GET' | 'POST' | 'UPDATE' | 'DELETE' | null;
  selectedTodoId?: number | null;
  todo?: Todo;
};

const Loader: React.FC<Props> = ({
  loading,
  requestMethod,
  selectedTodoId,
  todo,
}) => {
  return (
    <>
      {todo && (
        <div
          data-cy="TodoLoader"
          className={`modal overlay ${loading && (requestMethod === 'UPDATE' || requestMethod === 'DELETE') && selectedTodoId === todo?.id ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </>
  );
};

export default Loader;
