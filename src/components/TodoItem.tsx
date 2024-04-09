import cn from 'classnames';

import { Todo } from '../types/Todo';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Loader } from './Loader';
import { ErrorTypes } from '../types/enums';
import { updateTodos } from '../api/todos';
import { handleError } from '../utils/services';

type Props = {
  todo: Todo;
  setSelectedTodo: (todo: Todo | null) => void;
  isLoading: number[];
  selectedTodo: Todo | null;
  onDelete: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setSelectedTodo,
  isLoading,
  selectedTodo,
  onDelete,
  setIsLoading,
  setTodos,
  setErrorMessage,
}) => {
  const isTodoChanged =
    todo.title !== selectedTodo?.title ||
    selectedTodo?.completed !== todo.completed;

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
        handleError(ErrorTypes.OnUpdErr, setErrorMessage);
      })
      .finally(() => {
        setSelectedTodo(null);
        setIsLoading(prev => prev.filter(item => item !== updTodo.id));
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
            onKeyUp={handleEsc}
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
      <Loader isLoading={isLoading} id={todo.id} />
    </div>
  );
};
