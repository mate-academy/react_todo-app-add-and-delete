/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';

import { ErrorMessages } from './components/ErrorMessages/ErrorMessages';
import { TodoList } from './components/TodoList/TodoList';
import { TodoOnAdd } from './components/TodoOnAdd/TodoOnAdd';

const ERROR_DURATION = 3000;

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('all');
  const [isError, setIsError] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then((response) => {
          setTodos(response);
          setVisibleTodos(response);
        })
        .catch(() => {
          setIsError('load');

          setTimeout(() => {
            setIsError('');
          }, ERROR_DURATION);
        });
    }
  }, []);

  const onAddNewTodo = async () => {
    setIsAdding(true);

    if (!newTodo.length) {
      setIsError('length');
      setIsAdding(false);
      setTimeout(() => {
        setIsError('');
      }, ERROR_DURATION);

      return;
    }

    if (user) {
      try {
        const newTodoFromAPI = await addTodo(newTodo, user.id);

        setVisibleTodos(prevState => [...prevState, newTodoFromAPI]);
      } catch {
        setIsError('add');
        setTimeout(() => {
          setIsError('');
        }, ERROR_DURATION);
      }
    }

    setNewTodo('');
    setIsAdding(false);
  };

  const onDeleteAllCompleted = async () => {
    setIsDeletingAll(true);

    try {
      await Promise.all(visibleTodos.map(todoItem => {
        if (todoItem.completed) {
          return deleteTodo(todoItem.id);
        }

        return null;
      }));

      setVisibleTodos(prevState => (
        prevState.filter(todoItem => !todoItem.completed)
      ));
    } catch (e) {
      setIsError('deleteAll');
      setTimeout(() => {
        setIsError('');
      }, ERROR_DURATION);
    }

    setIsDeletingAll(false);
  };

  const filterTodos = () => {
    if (filterBy === 'completed') {
      return visibleTodos.filter(todoFilter => todoFilter.completed);
    }

    if (filterBy === 'active') {
      return visibleTodos.filter(todoFilter => !todoFilter.completed);
    }

    return visibleTodos;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();

              onAddNewTodo();
            }}
          >
            <input
              disabled={isAdding}
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              setError={setIsError}
              setDeleted={setVisibleTodos}
              todos={filterTodos()}
              isDeletingAll={isDeletingAll}
            />

            {isAdding && <TodoOnAdd title={newTodo} />}

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {visibleTodos
                  .filter(task => (
                    !task.completed)).length}
                {' items left'}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filterBy === 'all',
                  })}
                  onClick={() => setFilterBy('all')}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filterBy === 'active',
                  })}
                  onClick={() => setFilterBy('active')}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filterBy === 'completed',
                  })}
                  onClick={() => setFilterBy('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={!visibleTodos.some(
                  todoItem => (
                    todoItem.completed
                  ),
                )}
                onClick={(event) => {
                  event.preventDefault();

                  onDeleteAllCompleted();
                }}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {isError && (
        <ErrorMessages
          error={isError}
          onClose={() => setIsError('')}
        />
      )}
    </div>
  );
};
