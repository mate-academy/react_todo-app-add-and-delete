/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { SelectFilter } from './utils/SelectFilter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorMessage } from './utils/ErrorMessages';

const USER_ID = 11539;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterOption, setFilterOption] = useState(SelectFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const isToggleActive = useMemo(() => todos.some(todo => !todo.completed),
    [todos]);
  const titleInput = useRef<HTMLInputElement>(null);

  const setError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const activeTodosCounter = useMemo(() => {
    const activeTodos = todos.filter(todo => !todo.completed).length;

    return activeTodos;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterOption) {
        case SelectFilter.Active: return !todo.completed;
        case SelectFilter.Completed: return todo.completed;
        case SelectFilter.All:
        default: return true;
      }
    });
  }, [todos, filterOption]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  });

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((error: Error) => {
        setError(ErrorMessage.UnableLoad);
        // eslint-disable-next-line no-console
        console.log(error.message);
      });
  }, []);

  const handleTodoAdd = (newTodoTitle: string) => {
    if (!newTodoTitle.trim()) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    addTodo(newTodoTitle.trim())
      .then((newTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setIsLoaderActive(true);
      }).catch(() => {
        setError(ErrorMessage.UnableAdd);
      }).finally(() => {
        setTempTodo(null);
        setIsLoaderActive(false);
      });
  };

  const handleTodoDelete = (todoId: number): void => {
    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos: Todo[]) => (
          prevTodos.filter(todo => todo.id !== todoId)
        ));
        setIsLoaderActive(true);
      })
      .catch(() => {
        setError(ErrorMessage.UnableDelete);
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTodoAdd={handleTodoAdd}
          isToggleActive={isToggleActive}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={cn(
                'todo',
                { completed: todo.completed },
              )}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  setErrorMessage('');
                  handleTodoDelete(todo.id);
                }}
              >
                ×
              </button>
              {/* overlay will cover the todo while it is being updated */}
              <div
                data-cy="TodoLoader"
                className={cn(
                  'modal',
                  'overlay',
                  { 'is-active': isLoaderActive },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {/* This todo is being edited
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            {/* This form is shown instead of the title and remove button }
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
          */ }

          {/* This todo is in loadind state */}
          {!!tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div
                data-cy="TodoLoader"
                className={cn(
                  'modal',
                  'overlay',
                  { 'is-active': isLoaderActive },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCounter} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn(
                  'filter__link',
                  { selected: filterOption === SelectFilter.All },
                )}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilterOption(SelectFilter.All);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn(
                  'filter__link',
                  { selected: filterOption === SelectFilter.Active },
                )}
                data-cy="FilterLinkActive"
                onClick={() => setFilterOption(SelectFilter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn(
                  'filter__link',
                  { selected: filterOption === SelectFilter.Completed },
                )}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterOption(SelectFilter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          onClick={() => setErrorMessage('')}
          className="delete"
        />
        {errorMessage}
      </div>
    </div>
  );
};
