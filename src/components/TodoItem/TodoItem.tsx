/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import {
  handleDeleteTodo,
  handleUpdateTodo,
  ActionEvents,
} from '../../utils/utilityFunctions';
import {
  TodosContext,
  ErrorContext,
  isClearingContext,
  isUpdatingContext,
} from '../../utils/Store';

interface TodoItemProps {
  todo: Todo;
  isTemp?: Todo | null;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isTemp }) => {
  const { title, id, completed } = todo;

  const { todos, setTodos } = React.useContext(TodosContext);
  const { setIsError } = React.useContext(ErrorContext);
  const { isClearing } = React.useContext(isClearingContext);
  const { isUpdating } = React.useContext(isUpdatingContext);

  const [isLoading, setIsLoading] = React.useState(() =>
    isTemp ? true : false,
  );
  const [isFocused, setIsFocused] = React.useState(false);
  const [query, setQuery] = React.useState(title);

  const newList = React.useMemo(() => {
    return todos.filter(item => item.id !== id);
  }, [todos, id]);

  const updatedTodoArguments = {
    query: query.trim(),
    id: id,
    title: title,
    completed: completed,
    todo: todo,
    todos: todos,
    setIsLoading: setIsLoading,
    setTodos: setTodos,
    setIsError: setIsError,
    setIsFocused: setIsFocused,
  };

  const deleteTodoArguments = {
    id: id,
    newList: newList,
    setIsLoading: setIsLoading,
    setTodos: setTodos,
    setIsError: setIsError,
  };

  const editingEvent = (event: ActionEvents) => {
    setQuery(query.trim());

    if (query.trim() === title) {
      return setIsFocused(false);
    }

    return query
      ? handleUpdateTodo({
          ...updatedTodoArguments,
          event,
          newData: title.trim(),
        })
      : handleDeleteTodo({ ...deleteTodoArguments, event });
  };

  React.useEffect(() => {
    const keyEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFocused(false);
        setQuery(title);
      }
    };

    document.addEventListener('keyup', keyEvent);

    return () => {
      document.removeEventListener('keyup', keyEvent);
    };
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={event =>
            handleUpdateTodo({
              ...updatedTodoArguments,
              event,
              newData: completed,
            })
          }
        />
      </label>

      {isFocused ? (
        <form
          onSubmit={event => editingEvent(event)}
          onBlur={event => editingEvent(event)}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={event => setQuery(event.target.value)}
            ref={input => input && input.focus()}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsFocused(true)}
          >
            {query}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={event =>
              handleDeleteTodo({ ...deleteTodoArguments, event })
            }
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading ||
            (isUpdating && !todo.completed) ||
            (isClearing && todo.completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
