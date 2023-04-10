/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';

const USER_ID = 6969;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadedIds, setLoadedIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => setTodos(result))
      .catch(() => {
        setError('load');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (title: string) => {
    setDisabledInput(true);

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then(result => {
        setTodos(prevState => [...prevState, result]);
      })
      .catch(() => {
        setError('add');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setLoadedIds(prevState => [...prevState, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('delete');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setLoadedIds([]);
      });
  };

  const removeCompleted = () => {
    const completeTodoList = todos.filter(todo => todo.completed);

    completeTodoList.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(order => !order.completed));
        })
        .catch(() => {
          setError('delete');
          setTimeout(() => {
            setError('');
          }, 3000);
        });
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setError('Tittle can not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    }

    addTodo(query);
    setQuery('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={disabledInput}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodoList
            todos={todos}
            tempTodo={tempTodo}
            loadedIds={loadedIds}
            removeTodo={removeTodo}
            removeCompleted={removeCompleted}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        { `Unable to ${error} a todo` }
      </div>
    </div>
  );
};
