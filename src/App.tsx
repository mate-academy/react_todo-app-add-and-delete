/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState, useMemo, ChangeEvent,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [isSelected, setIsSelected] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [idsDeletedTodos, setIdsDeletedTodos] = useState<number[]>([]);

  const loadTodos = async () => {
    setHasError(false);

    try {
      const todosFromServer = user && await getTodos(user.id);

      if (todosFromServer) {
        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasError(true);
      throw new Error('There are not todos for this user');
    }
  };

  const visibleTodos = useMemo(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterType) {
        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return todos;
      }
    });

    return filteredTodos;
  }, [todos, filterType]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (hasError) {
      setTimeout(() => {
        setHasError(false);
      }, 3000);
    }
  });

  const handleChangeFilterButton = (event:
  React.MouseEvent<HTMLAnchorElement>) => {
    setIsSelected(event.currentTarget.text);

    switch (event.currentTarget.text) {
      case 'Active':
        return setFilterType(FilterType.ACTIVE);

      case 'Completed':
        return setFilterType(FilterType.COMPLETED);

      default:
        return setFilterType(FilterType.ALL);
    }
  };

  const setCurrentTodos = (todo: Todo) => {
    if (!todos.some(todoFromServer => todo.id === todoFromServer.id)) {
      if (todo.id === activeTodoId) {
        setActiveTodoId(todo.id);
        setIsLoading(true);
        setTodos((prevTodos) => [...prevTodos, todo]);
      }
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.value);
  };

  const addNewTodo = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldValue('');
    setIsAdding(true);

    if (user) {
      const newTodo = await addTodo(fieldValue, user.id);

      setCurrentTodos(newTodo);
    }

    try {
      if (fieldValue.length === 0) {
        setHasError(true);
        setErrorText('Title cannot be empty');

        return;
      }

      await loadTodos();
    } catch (error) {
      setHasError(true);
      setErrorText('Unable to add a todo');
      throw new Error(errorText);
    } finally {
      setFieldValue('');
      setIsLoading(false);
      setIsAdding(false);
    }
  };

  const deleteTodo = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    setActiveTodoId(+event.currentTarget.value);

    try {
      await removeTodo(+event.currentTarget.value);
      loadTodos();
    } catch (error) {
      setHasError(true);
      setErrorText('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCompletedTodos = async () => {
    setIsLoading(true);

    try {
      const completedTodos = todos.filter(todo => todo.completed);

      setIdsDeletedTodos(completedTodos.map(todo => todo.id));

      await Promise.all(completedTodos.map(async (todo) => {
        await removeTodo(todo.id);
      }));
      loadTodos();
    } catch (error) {
      setHasError(true);
      setErrorText('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line
  console.log(activeTodoId);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />
          )}

          <form onSubmit={addNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              value={fieldValue}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleInputChange}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <ul>
            {visibleTodos.map(todo => {
              const { title, completed, id } = todo;

              return (
                <li
                  data-cy="Todo"
                  key={id}
                  className={classNames('todo',
                    { completed })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    value={id}
                    onClick={deleteTodo}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={((id === activeTodoId)
                      || idsDeletedTodos.includes(id))
                      && isLoading
                      ? 'modal overlay is-active'
                      : 'modal overlay'}
                  >
                    <div
                      className="modal-background has-background-white-ter"
                    />

                    <div className="loader" />
                  </div>
                </li>
              );
            })}

          </ul>
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames('filter__link',
                  { selected: isSelected === 'All' })}
                onClick={handleChangeFilterButton}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames('filter__link',
                  { selected: isSelected === 'Active' })}
                onClick={handleChangeFilterButton}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames('filter__link',
                  { selected: isSelected === 'Completed' })}
                onClick={handleChangeFilterButton}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={classNames('todoapp__clear-completed',
                { hidden: !todos.some(todo => todo.completed) })}
              onClick={removeCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
          { hidden: !hasError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setHasError(false);
          }}
        />

        {errorText}
      </div>
    </div>
  );
};
