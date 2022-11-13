import React, { useContext, useEffect, useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { ErrorTodo } from '../../types/ErrorTodo';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppContext';

type Props = {
  todo: Todo,
};

enum Loader {
  Show = 'block',
  Hide = 'none',
}

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {
    showErrorMessage,
    todosFromServer,
    setTodosFromServer,
  } = useContext(AppContext);
  const [showLoader, setShowLoader] = useState(Loader.Hide);

  useEffect(() => {
    if (todo.id === 0) {
      setShowLoader(Loader.Show);
    }
  }, []);

  const onDeleteTodo = async () => {
    setShowLoader(Loader.Show);
    const deletedTodo = await deleteTodo(todo.id);

    try {
      if (typeof deletedTodo !== 'number' && 'Error' in deletedTodo) {
        throw new Error();
      }

      if (todosFromServer?.length === 1) {
        setTodosFromServer(undefined);

        return;
      }

      if (todosFromServer) {
        setTodosFromServer(todosFromServer.filter(
          todoFromServer => todoFromServer.id !== todo.id,
        ));
      }
    } catch {
      showErrorMessage(ErrorTodo.Delete);
    } finally {
      setShowLoader(Loader.Hide);
    }
  };

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
