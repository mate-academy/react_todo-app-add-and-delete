import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodo, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 11548;

enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const filterTodos = (todos: Todo[], filter: FilterType) => {
  return todos.filter(todo => {
    switch (filter) {
      case FilterType.All:
        return true;
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};

type SetErrorMessageType = React.Dispatch<React.SetStateAction<string | null>>;
type MessageType = string;

const handleErrorMessage = (
  setErrorMessage: SetErrorMessageType,
  message: MessageType,
) => {
  setErrorMessage(message);
  setTimeout(() => {
    setErrorMessage(null);
  }, 3000);
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterType>(
    FilterType.All,
  );
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const [isEditing, setIsEditing] = useState<Record<number, boolean>>({});
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleEditing = (id: number) => {
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [id]: !prevIsEditing[id],
    }));
  };

  useEffect(() => {
    if (isInputFocused) {
      inputRef.current?.focus();
      setIsInputFocused(false);
    }
  }, [isInputFocused]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsInputDisabled(true);
      try {
        const fetchedTodos = await getTodos(USER_ID);

        setTodos(fetchedTodos);
        setIsInputDisabled(false);
      } catch (error) {
        if (error instanceof Error) {
          handleErrorMessage(setErrorMessage, error.message
            || 'Unable to load todos');
        } else {
          handleErrorMessage(setErrorMessage, 'Unable to load todos');
        }
      } finally {
        setIsInputFocused(true);
      }
    };

    fetchTodos();
  }, []);

  const addNewTodo = (currentTitle: string) => {
    setIsInputDisabled(true);
    setErrorMessage('');

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: currentTitle,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    addTodo(newTodo)  // This is your API call
      .then(createdTodo => {
        setTempTodo(null);
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setTempTodo(null);
        handleErrorMessage(setErrorMessage, 'Unable to add a todo');
      })
      .finally(() => {
        setIsInputDisabled(false);
        setIsInputFocused(true);
      });
  };

  const handleNewTodoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();
    if (!trimmedTitle) {
      handleErrorMessage(setErrorMessage, 'Title should not be empty');
      return;
    }
    addNewTodo(trimmedTitle);
  };

  const handleTodoToggle = async (todoId: number, completed: boolean) => {
    const originalTodos = [...todos];

    setTodos(prevTodos => prevTodos.map(todo => (todo.id === todoId
      ? { ...todo, completed }
      : todo)));
    try {
      await updateTodo(todoId, { completed });
    } catch (error) {
      setTodos(originalTodos);
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    setIsLoading({ ...isLoading, [todoId]: true });
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      handleErrorMessage(setErrorMessage, 'Unable to delete a todo');
    } finally {
      setIsInputFocused(true);
    }

    setIsLoading({ ...isLoading, [todoId]: false });
  };

  const toggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const toggledTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(toggledTodos);
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(async (todo) => {
      try {
        await deleteTodo(todo.id);
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== todo.id));
      } catch (error) {
        handleErrorMessage(setErrorMessage, 'Unable to delete a todo');
      } finally {
        setIsInputFocused(true);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, currentFilter);
  const uncompletedCount = todos.filter((todo: Todo) => !todo.completed).length;
  const allTodosAreActive = todos.every((todo: Todo) => !todo.completed);
  const shouldShowFooter = todos.length > 0 && (
    currentFilter === FilterType.All
    || (currentFilter === FilterType.Active && uncompletedCount > 0)
    || (currentFilter === FilterType.Completed
      && uncompletedCount < todos.length)
    || allTodosAreActive
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {filteredTodos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
              aria-label="Toggle All"
              onClick={toggleAllTodos}
            />
          )}
          <form onSubmit={handleNewTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              disabled={isInputDisabled}
              onChange={event => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>
        {filteredTodos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map((todo) => (
              <div key={todo.id} data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => handleTodoToggle(todo.id, !todo.completed)}
                  />
                </label>
                {isEditing[todo.id] ? (
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={todo.title}
                  />
                ) : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onClick={() => toggleEditing(todo.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        toggleEditing(todo.id);
                      }
                    }}
                  >
                    {todo.title}
                  </span>
                )}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleTodoDelete(todo.id)}
                >
                  ×
                </button>
                <div data-cy="TodoLoader" className={`modal overlay ${isLoading[todo.id] ? 'is-active' : ''}`}>
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
            {tempTodo && (
              <div key={tempTodo.id} data-cy="TempTodo" className={`todo ${tempTodo.completed ? 'completed' : ''}`}>
                <label className="todo__status-label">
                  <input
                    data-cy="TempTodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={tempTodo.completed}
                    disabled
                  />
                </label>
                <span
                  data-cy="TempTodoTitle"
                  className="todo__title"
                >
                  Test Todo
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TempTodoDelete"
                  disabled
                >
                  ×
                </button>
                <div data-cy="TempTodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}
        {shouldShowFooter && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {uncompletedCount}
              {' '}
              {uncompletedCount === 1 ? 'items' : 'items'}
              {' '}
              left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${currentFilter === FilterType.All ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setCurrentFilter(FilterType.All)}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${currentFilter === FilterType.Active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setCurrentFilter(FilterType.Active)}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${currentFilter === FilterType.Completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setCurrentFilter(FilterType.Completed)}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={allTodosAreActive || todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
          aria-label="Hide error"
        />
        {errorMessage}
      </div>
    </div>
  );
};
