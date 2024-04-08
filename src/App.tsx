/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoContext } from './context/TodosContext';
import { Todo } from './types/Todo';
import { ErrorContext } from './context/ErrorContext';

enum FilterOptions {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const App: React.FC = () => {
  const { todos, dispatch } = useContext(TodoContext);
  const { errorMessage, handleErrorMessage } = useContext(ErrorContext);

  const [activeFilter, setActiveFilter] = useState(FilterOptions.ALL);
  const [query, setQuery] = useState('');
  const [isPostingTodo, setIsPostingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  let filteredTodos = todos;
  const inputRef = useRef<HTMLInputElement>(null);

  switch (activeFilter) {
    case FilterOptions.ACTIVE:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;
    case FilterOptions.COMPLETED:
      filteredTodos = todos.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos();

        dispatch({ type: 'SET_TODOS', payload: todosFromServer });
      } catch {
        handleErrorMessage('Unable to load todos');
      }
    };

    fetchTodos();
  }, [dispatch, handleErrorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const itemsLeft = todos.length - completedTodosCount;

  const handleFilterClick = (filter: FilterOptions) => {
    setActiveFilter(filter);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleErrorMessage(null);
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim() !== '') {
      setIsPostingTodo(true);

      try {
        const addTodo = {
          userId: USER_ID,
          title: query.trim(),
          completed: false,
        };

        setTempTodo({ ...addTodo, id: 0 });

        const newTodo = await postTodos(addTodo);

        dispatch({
          type: 'ADD_TODO',
          payload: newTodo,
        });

        setQuery('');
      } catch {
        handleErrorMessage('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setIsPostingTodo(false);
      }
    } else {
      handleErrorMessage('Title should not be empty');
    }
  };

  const handleClearCompleted = async () => {
    const getCompletedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      getCompletedTodos.map(async todo => {
        await deleteTodos(todo.id)
          .then(() => {
            dispatch({ type: 'DELETE_TODO', payload: todo.id });
          })
          .catch(() => {
            handleErrorMessage('Unable to delete a todo');
          });
      }),
    );
  };

  const handleToggleAllButton = () => {
    const toggleAll = !todos.every(todo => todo.completed);

    dispatch({ type: 'TOGGLE_ALL', payload: toggleAll });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            onClick={handleToggleAllButton}
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQueryChange}
              disabled={isPostingTodo}
            />
          </form>
        </header>

        {todos.length !== 0 && (
          <>
            <TodoList todos={filteredTodos} />
            {tempTodo !== null && <TodoItem todo={tempTodo} isTemp={true} />}

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {itemsLeft} items left
              </span>
              <nav className="filter" data-cy="Filter">
                {Object.values(FilterOptions).map(option => (
                  <a
                    key={option}
                    href={`#${option === FilterOptions.ALL ? '' : option.toLowerCase()}`}
                    className={cn('filter__link', {
                      selected: activeFilter === option,
                    })}
                    data-cy={`FilterLink${option}`}
                    onClick={() => handleFilterClick(option)}
                  >
                    {option}
                  </a>
                ))}
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodosCount === 0}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
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
          className="delete"
          onClick={() => handleErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
