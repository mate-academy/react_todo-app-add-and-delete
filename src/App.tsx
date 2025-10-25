/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import TodoList from './components/TodoList/TodoList';
import { Todo, ErrorMessages, StatusTodos } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import classNames from 'classnames';
import TodoHeader from './components/TodoHeader/TodoHeader';

const filtredTodos = (status: StatusTodos, todos: Todo[]): Todo[] => {
  return todos.filter(todo => {
    switch (status) {
      case StatusTodos.ACTIVE:
        return !todo.completed;
      case StatusTodos.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filterStatus, setFilterStatus] = useState<StatusTodos>(
    StatusTodos.ALL,
  );

  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NO_ERROR,
  );

  // Load Todos
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.ERROR_LOAD_TODOS));
  }, []);

  // Error Message Timer
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorMessages.NO_ERROR);
    }, 3000);

    return () => clearInterval(timerId);
  }, [errorMessage]);

  // Add Todo handler
  function handlePostTodo(title: string): Promise<void> {
    const newTempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: 0,
    };

    setTempTodo(newTempTodo);

    return postTodo(title)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.ERROR_ADD_TODO);

        throw new Error('Unable to add todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== 0));
        setTempTodo(null);
      });
  }

  //Delete Todo Handler
  function handleDeleteTodo(todoId: number) {
    setLoadingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorMessages.ERROR_DELETE_TODO))
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      });
  }

  //ClearCompleted TodoHandler
  function handlerClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosId = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedTodosId]);

    const promisess = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(promisess)
      .then(results => {
        const succesfullDeleteId: number[] = [];
        let hasError = false;

        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            hasError = true;
          } else {
            succesfullDeleteId.push(completedTodos[index].id);
          }
        });

        if (hasError) {
          setErrorMessage(ErrorMessages.ERROR_DELETE_TODO);
        }

        setTodos(prevTodos =>
          prevTodos.filter(todo => !succesfullDeleteId.includes(todo.id)),
        );
      })
      .finally(() => {
        setLoadingIds(prev =>
          prev.filter(id => !completedTodosId.includes(id)),
        );
      });
  }

  const filterTodos = filtredTodos(filterStatus, todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={handlePostTodo}
          disabled={loadingIds.length > 0 || tempTodo !== null}
          onErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={filterTodos}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterStatus === StatusTodos.ALL,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterStatus(StatusTodos.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterStatus === StatusTodos.ACTIVE,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterStatus(StatusTodos.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterStatus === StatusTodos.COMPLETED,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterStatus(StatusTodos.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
              onClick={handlerClearCompleted}
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
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage.length,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessages.NO_ERROR)}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
