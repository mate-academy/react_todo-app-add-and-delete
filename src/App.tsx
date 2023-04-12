/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';

const USER_ID = 7001;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [isWaitingForDelte, setIsWaitingForDelete] = useState(0);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setError('load');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const addNewTodo = (todo: Omit<Todo, 'id'>) => {
    setIsDisabledInput(true);
    setTempTodo({ ...todo, id: 0 });

    if (todo.title) {
      postTodos(todo)
        .then(result => {
          setTodos(state => [...state, result]);
        })
        .catch(() => {
          setError('Unable to add a todo');
          setTimeout(() => {
            setError('');
          }, 3000);
        })
        .finally(() => {
          setIsDisabledInput(false);
          setTempTodo(undefined);
        });
    } else {
      setError('Title can`t be empty');
    }
  };

  const removeTodo = (id: number) => {
    setIsWaitingForDelete(id);

    return deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setIsWaitingForDelete(0);
      });
  };

  const removeComletedTodos = () => {
    setIsDeletingCompleted(true);

    completedTodos.forEach(todo => {
      deleteTodos(todo.id)
        .then(() => {
          setTodos(todos.filter(item => !item.completed));
        })
        .catch(() => {
          setError('Unable to delete todos');
        })
        .finally(() => {
          setIsDeletingCompleted(false);
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodos={activeTodos}
          onError={setError}
          userId={USER_ID}
          onAdd={addNewTodo}
          isDisabledInput={isDisabledInput}
        />
        <TodoList
          todos={todos}
          activeTodos={activeTodos}
          filterType={filterType}
          tempTodo={tempTodo}
          isWaitingForDelte={isWaitingForDelte}
          removeTodo={removeTodo}
          isDeletingCompleted={isDeletingCompleted}
        />
        {todos.length > 0 && (
          <Footer
            completedTodos={completedTodos}
            activeTodos={activeTodos}
            filterType={filterType}
            onSetFilterType={setFilterType}
            onDeleteCompletedTodos={removeComletedTodos}
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
          onClick={() => (setError(''))}
        />

        {error}
      </div>
    </div>
  );
};
