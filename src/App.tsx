/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { FilterStatus, Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './todosMethods';
import { Error } from './components/Error';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';

const USER_ID = 11220;

function getPreparedTodo(todosFilter: Todo[], filterField: FilterStatus) {
  return todosFilter.filter(todo => {
    switch (filterField) {
      case FilterStatus.Completed:
        return todo.completed;

      case FilterStatus.Active:
        return !todo.completed;

      default:
        return todo;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(FilterStatus.All);

  const clearError = () => {
    setErrorMessage('');
  };

  const applyFilter = (filterField: FilterStatus) => {
    setFilter(filterField);
  };

  const preparedTodo = useMemo(() => {
    return getPreparedTodo(todos, filter);
  }, [todos, filter]);

  const createTodo = () => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    return addTodo({
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(previousTodo => [...previousTodo, newTodo]);
      })
      .catch(err => {
        setErrorMessage('Can`t add new todo');
        throw err;
      })
      .finally(() => setTempTodo(null));
  };

  const removeTodo = (todoId: number) => {
    setIsLoading(true);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(previousTodos => {
          return previousTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch((err) => {
        setTodos(todos);
        setErrorMessage('Can`t delete todo');
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  const clearCompleted = () => {
    setIsLoading(true);
    setTodos(prevTodos => {
      return prevTodos.filter(todo => {
        if (todo.completed) {
          deleteTodo(todo.id)
            .catch((error) => {
              setTodos(todos);
              setErrorMessage('Unable to delete a todo');
              throw error;
            })
            .finally(() => setIsLoading(false));

          return false;
        }

        return true;
      });
    });
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch((err) => {
        setErrorMessage('Can`t get todo');
        throw err;
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
          />
        )}

        <TodoForm
          todoTitle={todoTitle}
          setTitle={(newTitle) => setTodoTitle(newTitle)}
          createTodo={createTodo}
        />
      </header>
      <div className="todoapp__content">
        {todos.length > 0 && (
          <TodoList
            todos={preparedTodo}
            deleteTodo={(todoId: number) => removeTodo(todoId)}
            isLoading={isLoading}
          />
        )}
        {
          tempTodo !== null
          && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo?.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className={classNames('modal overlay', {
                'is-active': tempTodo !== null,
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )
        }

        {todos.length > 0 && (
          <TodoFilter
            selected={filter}
            filter={applyFilter}
            clearCompleted={clearCompleted}
            todos={todos}
          />
        )}
      </div>

      <Error
        message={errorMessage}
        onClose={clearError}
      />
    </div>
  );
};
