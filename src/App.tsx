/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line object-curly-newline
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { FilterType } from './types/FilterType';
import { getFilteredTodos } from './utils/getFilteredTodos';

const USER_ID = 7002;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState(0);

  const activeTodosQuantity = todos.filter((todo) => !todo.completed).length;
  const completedTodosQuantity = todos.length - activeTodosQuantity;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todo');

        setTimeout(() => setError(''), 3000);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const handleAddTodo = (title: string) => {
    if (title.length === 0) {
      setError('Title can\'t be empty');
      setTimeout(() => setError(''), 3000);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo(newTodo);
      setError('');

      postTodo(newTodo)
        .then((todo) => {
          setTodos((prevTodos) => {
            return [...prevTodos, todo];
          });
        })
        .catch(() => {
          setError('Unable to add new todo');
          setTimeout(() => setError(''), 3000);
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const handleDeleteTodo = useCallback(
    (id: number) => {
      setLoadingTodoId(id);

      return deleteTodo(id)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.filter((todo) => todo.id !== id);
          });
        })
        .catch(() => {
          setError('Unable to delete a todo');
          setTimeout(() => setError(''), 3000);
        })
        .finally(() => {
          setTempTodo(null);
          setLoadingTodoId(0);
        });
    },
    [deleteTodo],
  );

  const handleClearCompleted = () => {
    todos.filter((todo) => todo.completed).forEach((todo) => {
      handleDeleteTodo(todo.id)
        .then(() => setTodos(todos.filter(({ completed }) => !completed)));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader onSubmit={handleAddTodo} />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              loadingTodoId={loadingTodoId}
            />

            <TodoFooter
              setFilterType={setFilterType}
              filterType={filterType}
              activeTodosQuantity={activeTodosQuantity}
              completedTodosQuantity={completedTodosQuantity}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>
    </div>
  );
};
