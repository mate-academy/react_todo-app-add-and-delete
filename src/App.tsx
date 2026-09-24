/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TempTodo } from './components/TempTodo/TempTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterState, setfilterState] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);
  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);
  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterState) {
        case Filter.Completed:
          return todo.completed;
        case Filter.Active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterState]);

  function showError(message: string) {
    setErrorMessage(message);
    if (timerId.current !== null) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  function setTodoLoading(id: number, loading: boolean) {
    setLoadingTodoIds(prevIds =>
      loading ? [...prevIds, id] : prevIds.filter(todoId => todoId !== id),
    );
  }

  function toggleTodo(newTodo: Todo) {
    setTodoLoading(newTodo.id, true);

    return updateTodo({ ...newTodo, completed: !newTodo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showError('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setTodoLoading(newTodo.id, false);
      });
  }

  function addTodo(newTitle: string) {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });

    return createTodo(newTitle)
      .then(createdTodo => setTodos(prevTodos => [...prevTodos, createdTodo]))
      .catch(error => {
        showError('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }

  function deleteTodoOnClick(id: number) {
    setTodoLoading(id, true);

    return deleteTodo(id)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)),
      )
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setTodoLoading(id, false);
      });
  }

  function deleteAllCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(completedTodos.map(todo => deleteTodoOnClick(todo.id)));
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          activeCount={activeTodos}
          onAdd={addTodo}
          onError={showError}
          inProcess={tempTodo !== null}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            return (
              <TodoItem
                todo={todo}
                key={todo.id}
                onToggle={toggleTodo}
                onDelete={deleteTodoOnClick}
                isLoading={loadingTodoIds.includes(todo.id)}
              />
            );
          })}
        </section>
        {tempTodo && <TempTodo beforeServerTodo={tempTodo} />}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterState === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setfilterState(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterState === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setfilterState(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterState === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setfilterState(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* {hasCompletedTodo && (*/}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodo}
              onClick={deleteAllCompleted}
            >
              Clear completed
            </button>
            {/* )}*/}
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        {/*

        <br />
        Unable to update a todo*/}
      </div>
    </div>
  );
};
