import cn from 'classnames';

import { Todo } from '../types/Todo';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Loader } from './Loader';
import { ErrorTypes } from '../types/enums';
import { updateTodos } from '../api/todos';
import { handleError } from '../utils/services';

type Props = {
  todo: Todo;
  setSelectedTodo: (todo: Todo | null) => void;
  loading: number[];
  selectedTodo: Todo | null;
  onDelete: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
  setLoading: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setSelectedTodo,
  loading,
  selectedTodo,
  onDelete,
  setLoading,
  setTodos,
  setErrorMessage,
}) => {
  const isTodoChanged =
    todo.title !== selectedTodo?.title ||
    selectedTodo?.completed !== todo.completed;

  const [isDoubleClicked, setIsDoubleClicked] = useState<boolean>(false);

  useEffect(() => {
    const handleEsc = (event: { key: string }) => {
      if (event.key === 'Escape' && isDoubleClicked) {
        setIsDoubleClicked(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isDoubleClicked]);

  const onPatch = (updTodo: Todo) => {
    if (updTodo.title.trim() === '') {
      onDelete(updTodo.id);

      return;
    }

    setLoading(prev => [...prev, todo.id]);

    updateTodos(updTodo.id, updTodo)
      .then((updatedTodo: Todo) => {
        {
          setTodos((currentTodos: Todo[]) =>
            currentTodos.map(item =>
              item.id === updatedTodo.id ? updatedTodo : item,
            ),
          );
          setIsDoubleClicked(false);
        }
      })
      .catch(() => {
        handleError(ErrorTypes.updErr, setErrorMessage);
      })
      .finally(() => {
        setSelectedTodo(null);
        setLoading(prev => prev.filter(item => item !== updTodo.id));
      });
  };

  const onFormSubmit = (
    event?: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>,
    newTodo?: Todo,
  ) => {
    event?.preventDefault();

    if (newTodo && isTodoChanged) {
      onPatch(newTodo);

      return;
    }

    if (selectedTodo && isTodoChanged) {
      onPatch({ ...selectedTodo, title: selectedTodo.title.trim() });
    }

    if (!isTodoChanged) {
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
          onChange={event => {
            const newtodo = {
              ...todo,
              completed: !todo.completed,
            };

            onFormSubmit(event, newtodo);
          }}
        />
      </label>

      {selectedTodo?.id === todo.id && isDoubleClicked ? (
        <form onSubmit={onFormSubmit} onBlur={onFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={selectedTodo ? selectedTodo.title : todo.title}
            onChange={event => {
              setSelectedTodo({
                ...selectedTodo,
                title: event.target.value,
              });
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setSelectedTodo(todo);
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
      <Loader loading={loading} id={todo.id} />
    </div>
  );
};
