import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import classNames from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
  setErrorMessage,
}) => {
  const [isDeleted, setDeleted] = useState(false);

  const handleDelete = () => {
    setDeleted(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(tod => tod.id !== todo.id));
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');
      });
  };

  return (
    <TransitionGroup>
      <CSSTransition
        key={todo.id}
        timeout={300}
        classNames="item"
      >
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDelete}
          >
            ×
          </button>

          {isDeleted && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
