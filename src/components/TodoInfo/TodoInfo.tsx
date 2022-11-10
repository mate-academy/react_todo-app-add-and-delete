import React, { useContext, useEffect, useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppContext';

type Props = {
  todo: Todo,
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {
    showErrorMessage,
    todosFromServer,
    setTodosFromServer,
    completedTodosId,
    setCompletedTodosId,
  } = useContext(AppContext);
  const [showLoader, setShowLoader] = useState('none');

  useEffect(() => {
    if (todo.id === 0) {
      setShowLoader('block');
    }
  }, []);

  const onDeleteTodo = async () => {
    setShowLoader('block');
    const deletedTodo = await deleteTodo(todo.id);

    try {
      if (typeof deletedTodo !== 'number' && 'Error' in deletedTodo) {
        throw new Error();
      }

      if (todosFromServer?.length === 1 && !completedTodosId?.length) {
        setTodosFromServer(undefined);

        return;
      }

      if (todosFromServer && !completedTodosId?.length) {
        setTodosFromServer(todosFromServer.filter(
          todoFromServer => todoFromServer.id !== todo.id,
        ));
      }

      if (todosFromServer && completedTodosId?.length) {
        setTodosFromServer(todosFromServer.filter(
          todoFromServer => !completedTodosId?.includes(todoFromServer.id),
        ));
      }
    } catch {
      setShowLoader('none');
      showErrorMessage('delete');
    } finally {
      setCompletedTodosId([]);
    }
  };

  useEffect(() => {
    if (completedTodosId?.includes(todo.id)) {
      onDeleteTodo();
    }
  }, [completedTodosId]);

  return (
    <>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        { todo.title }
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={onDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className="modal overlay"
        style={{ display: showLoader }}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
