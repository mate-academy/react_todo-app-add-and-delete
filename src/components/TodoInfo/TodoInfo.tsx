import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoFilter';
import { client } from '../../utils/fetchClient';

type OneTodo = {
  todo: Todo
  todosUpdate: () => void
  errorHandler: (errorType: TodoError) => void
};

export const TodoInfo: React.FC<OneTodo> = ({
  todo,
  todosUpdate,
  errorHandler,
}) => {
  const [todoLoader, setTodoLoader] = useState(false);

  const checkboxHandler = async () => {
    setTodoLoader(true);
    errorHandler(TodoError.noerror);
    const date = {
      completed: !todo.completed,
    };

    try {
      await client.patch(`/todos/${todo.id}`, date);
      todosUpdate();
    } catch {
      errorHandler(TodoError.update);
    } finally {
      setTodoLoader(false);
    }
  };

  const buttonHandler = async () => {
    setTodoLoader(true);
    errorHandler(TodoError.noerror);
    try {
      await client.delete(`/todos/${todo.id}`);
      todosUpdate();
    } catch {
      errorHandler(TodoError.delete);
    } finally {
      setTodoLoader(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={checkboxHandler}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={buttonHandler}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todoLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
