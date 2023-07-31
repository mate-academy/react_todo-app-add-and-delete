/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoFilter } from './components/TodoFilter';
import { TodoErrors } from './components/TodoErrors';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilteredParams } from './types/FilteredParams';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { USER_ID } from './utils/userId';
import { TodoForm } from './components/TodoForm';

function getPreparedTodos(todosForFilter: Todo[], filterField: FilteredParams) {
  return todosForFilter.filter(todo => {
    switch (filterField) {
      case FilteredParams.active:
        return !todo.completed;

      case FilteredParams.completed:
        return todo.completed;

      default:
        return todo;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filter, setFilter] = useState(FilteredParams.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(true);
  const [todoTitle, setTodoTitle] = useState('');
  const [temp, setTemp] = useState<Todo | null>(null);

  const unSetError = () => {
    setErrorMessage('');
  };

  // eslint-disable-next-line max-len
  const preparedTodos = useMemo(() => getPreparedTodos(todos, filter), [todos, filter]);

  const tempMarkup = (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span
        className="todo__title"
      >
        {temp?.title}
      </span>

      <button
        type="button"
        className="todo__remove"
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': temp !== null,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );

  const todosCheck = todos.length > 0;

  const createdNewTodo = async () => {
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTemp(newTodo);

    try {
      const addedTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (error) {
      setErrorMessage('Something went wrong with addition todo');
      throw error;
    } finally {
      setTemp(null);
    }
  };

  const removedTodo = async (todoId: number) => {
    setLoader(true);

    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => {
        return prevTodos.filter(todo => todo.id !== todoId);
      });
    } catch (error) {
      setTodos(todos);
      setErrorMessage('Something went wrong with deletion todo');
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const setClearCompletedTodo = () => {
    setLoader(true);

    setTodos(prevTodos => {
      return prevTodos.filter(todo => {
        if (todo.completed) {
          deleteTodo(todo.id)
            .catch((error) => {
              setTodos(todos);
              setErrorMessage('Something went wrong with deletion todo');
              throw error;
            })
            .finally(() => {
              setLoader(false);
            });

          return false;
        }

        return !todo.completed;
      });
    });
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable getting todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setLoader(false));
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
          setTodoTitle={setTodoTitle}
          createdNewTodo={createdNewTodo}
        />
      </header>

      <div className="todoapp__content">
        {todosCheck && (
          <TodoList
            todos={preparedTodos}
            removedTodo={(todoId: number) => removedTodo(todoId)}
            loader={loader}
          />
        )}
        {temp && tempMarkup}

        {todosCheck && (
          <TodoFilter
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            setClearCompletedTodo={setClearCompletedTodo}
          />
        )}
      </div>

      <TodoErrors
        error={errorMessage}
        setError={unSetError}
      />
    </div>
  );
};
