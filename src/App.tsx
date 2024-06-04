/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

type SortSelectOptions = 'all' | 'active' | 'completed';
export type ErrorMessages =
  | ''
  | 'Unable to load todos'
  | 'Title should not be empty'
  | 'Unable to add a todo'
  | 'Unable to delete a todo'
  | 'Unable to update a todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectSort, setSelectSort] = useState<SortSelectOptions>('all');
  const [error, setError] = useState<ErrorMessages>('');
  const [inputTodo, setInputTodo] = useState('');
  const [loading, setLoading] = useState(false);
  // const inputRefAddTodo = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   inputRefAddTodo.current?.focus();
  // }, [loading]);

  const todoList = useMemo(() => {
    return todos.filter(todo => {
      if (selectSort === 'active') {
        return !todo.completed;
      } else if (selectSort === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [selectSort, todos]);

  const remainingItemsCount = useMemo(() => {
    return todos.reduce((count, todo) => {
      if (todo.id !== 0 && !todo.completed) {
        return count + 1;
      }

      return count;
    }, 0);
  }, [todos]);

  useEffect(() => {
    getTodos()
      .then(todosPromise => {
        setTodos(todosPromise);
      })
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (error !== '') {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    setError('');
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    if (inputTodo.trim() === '') {
      setError('Title should not be empty');
    } else {
      setLoading(true);
      setTodos(currentTodos => [
        ...currentTodos,
        {
          id: 0,
          title: inputTodo,
          userId: USER_ID,
          completed: false,
        },
      ]);
      createTodo({
        title: inputTodo.trim(),
        userId: USER_ID,
        completed: false,
      })
        .then(newTodo => {
          setTodos(currentTodos => {
            currentTodos.pop();

            return [...currentTodos, newTodo];
          });
        })
        .then(() => setInputTodo(''))
        .catch(() => {
          setTodos(currentTodo => {
            currentTodo.pop();

            return [...currentTodo];
          });
          setError('Unable to add a todo');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function handleEveryCompleted(todosSelect: Todo[]) {
    setError('');
    setLoading(true);
    if (todosSelect.every(el => el.completed)) {
      todosSelect.map(todo => {
        updateTodo({
          id: todo.id,
          userId: USER_ID,
          title: todo.title,
          completed: !todo.completed,
        })
          .then(updatedTodo => {
            setTodos(
              [...todosSelect].map(todoRes => {
                return { ...todoRes, completed: updatedTodo.completed };
              }),
            );
          })
          .catch(() => setError('Unable to update a todo'))
          .finally(() => setLoading(false));
      });
    } else {
      todosSelect
        .filter(el => el.completed === false)
        .map(todo => {
          updateTodo({
            id: todo.id,
            userId: USER_ID,
            title: todo.title,
            completed: !todo.completed,
          })
            .then(updatedTodo => {
              setTodos(
                [...todosSelect].map(todoRes => {
                  return { ...todoRes, completed: updatedTodo.completed };
                }),
              );
            })
            .catch(() => setError('Unable to update a todo'))
            .finally(() => setLoading(false));
        });
    }
  }

  function handleDeleteCompletedTodos() {
    setError('');
    setLoading(true);
    todos
      .filter(el => el.completed)
      .forEach(todoCompleted => {
        deleteTodo(todoCompleted.id)
          .then(() => {
            setTodos(tds => tds.filter(el => el.id !== todoCompleted.id));
          })
          .catch(() => setError('Unable to delete a todo'))
          .finally(() => setLoading(false));
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length !== 0 && todos[0].id !== 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(el => el.completed) && todos.length !== 0 ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={() => handleEveryCompleted(todos)}
            />
          )}

          {/* Add a todo on form submit */}
          <form>
            <input
              ref={reference => {
                reference?.focus();
              }}
              data-cy="NewTodoField"
              type="text"
              value={inputTodo}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={e => setInputTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todoList={todoList}
            todos={todos}
            setTodos={setTodos}
            setError={setError}
            setLoading={setLoading}
          />
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {remainingItemsCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${selectSort === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setSelectSort('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${selectSort === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setSelectSort('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${selectSort === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setSelectSort('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(el => el.completed)}
              onClick={handleDeleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error === '' ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error === 'Unable to load todos' && 'Unable to load todos'}
        {error === 'Title should not be empty' && 'Title should not be empty'}
        {error === 'Unable to delete a todo' && 'Unable to delete a todo'}
        {error === 'Unable to add a todo' && 'Unable to add a todo'}
        {error === 'Unable to update a todo' && 'Unable to update a todo'}
      </div>
    </div>
  );
};
