import cn from 'classnames';

import { Todo } from '../types/Todo';
import { FormEvent, useState } from 'react';
import { Loader } from './Loader';
import { ErrorTypes } from '../types/enums';
import { updateTodos } from '../api/todos';
import { handleError } from '../utils/services';

type Props = {
  todo: Todo;
  isLoading: number[];
  onDelete: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  setIsLoading,
  setTodos,
  setErrorMessage,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);

  const [isDoubleClicked, setIsDoubleClicked] = useState<boolean>(false);

  const handleEsc = (event: { key: string }) => {
    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
    }
  };

  const onPatch = (updTodo: Todo) => {
    if (!updTodo.title.trim()) {
      onDelete(updTodo.id);

      return;
    }

    setIsLoading(prev => [...prev, todo.id]);

    updateTodos(updTodo.id, updTodo)
      .then((updatedTodo: Todo) => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.map(item =>
            item.id === updatedTodo.id ? updatedTodo : item,
          ),
        );
        setIsDoubleClicked(false);
      })
      .catch(() => {
        handleError(ErrorTypes.OnUpdErr, setErrorMessage);
      })
      .finally(() => {
        setIsLoading(prev => prev.filter(item => item !== updTodo.id));
      });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title !== newTitle) {
      onPatch({ ...todo, title: newTitle.trim() });
    } else {
      setIsDoubleClicked(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label aria-label="todo-status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            const newtodo = {
              ...todo,
              completed: !todo.completed,
            };

            onPatch(newtodo);
          }}
        />
      </label>

      {isDoubleClicked ? (
        <form onSubmit={onSubmit} onBlur={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={newTitle}
            onChange={event => {
              setNewTitle(event.target.value);
            }}
            onKeyUp={handleEsc}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsDoubleClicked(true);
          }}
        >
          {todo.title}
        </span>
      )}
      {!isDoubleClicked && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}
      <Loader isLoading={isLoading} id={todo.id} />
    </div>
  );
};
