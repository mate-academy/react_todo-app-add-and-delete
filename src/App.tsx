/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilterBar } from './components/TodoFilterBar';
import { TodoErrors } from './components/TodoErrors';
import { Todo } from './types/Todo';
import { addTodo, getTodos, deleteTodo } from './api/todos';
import { FilterParams } from './types/FilterParams';
import { USER_ID } from './utils/userId';
import { getPreperedTodos } from './utils/getPrepereadTodods';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filter, setFilter] = useState(FilterParams.all);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const preparedTodos = useMemo(() => {
    return getPreperedTodos(todos, filter);
  }, [todos, filter]);

  const clearError = () => {
    setErrorMessage('');
  };

  const tempTodoMarkup = (
    <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">{tempTodo?.title}</span>
      <button type="button" className="todo__remove">×</button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div className={classNames('modal overlay', {
        'is-active': tempTodo !== null,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );

  const todosCheck = todos.length > 0;

  const removeTodo = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setLoadingIds([]));
  };

  const clearCompleted = () => {
    setTodos(prevTodos => {
      return prevTodos.filter(todo => {
        if (todo.completed) {
          setLoadingIds(prevIds => [...prevIds, todo.id]);

          deleteTodo(todo.id)
            .catch(() => {
              setTodos(todos);
              setErrorMessage('Unable to delete a todo');
            })
            .finally(() => setLoadingIds([]));

          return false;
        }

        return true;
      });
    });
  };

  const createTodo = () => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    });

    return addTodo({
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add todo');
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage('Unable to get todos');
        throw error;
      })
      .finally(() => setLoadingIds([]));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <header className="todoapp__header">
        {todosCheck && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
          />
        )}

        <TodoForm
          todoTitle={todoTitle}
          setTodoTitle={(newTitle) => setTodoTitle(newTitle)}
          createTodo={createTodo}
        />
      </header>
      <div className="todoapp__content">
        {todosCheck && (
          <TodoList
            todos={preparedTodos}
            removeTodo={(todoId: number) => removeTodo(todoId)}
            loadingIds={loadingIds}
          />
        )}
        {tempTodo !== null && tempTodoMarkup}

        {todosCheck && (
          <TodoFilterBar
            filter={filter}
            applyFilter={setFilter}
            clearCompleted={clearCompleted}
            todos={todos}
          />
        )}
      </div>

      <TodoErrors
        error={errorMessage}
        clearError={clearError}
      />
    </div>
  );
};
