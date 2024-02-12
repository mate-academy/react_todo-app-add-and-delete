/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';

import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterEnum } from './utils/EnumFilter';
import * as todosService from './api/todos';
import { USER_ID } from './utils/consts';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

function getTodosFilterByStatus(todos: Todo[], sortField: string) {
  if (sortField === FilterEnum.ALL) {
    return todos;
  }

  if (sortField === FilterEnum.ACTIVE) {
    return todos.filter(todo => !todo.completed);
  }

  if (sortField === FilterEnum.COMPLETED) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState('');

  const [loading, setLoading] = useState(false);

  const [errorLoad, setErrorLoad] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [sortField, setSortField] = useState('All');

  const filterTodos = getTodosFilterByStatus(
    todos, sortField,
  );

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })

      .catch(() => {
        setErrorLoad('Unable to load todos');
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
      });
  }, []);

  const addTodo = ({
    title, completed, userId,
  }: Omit<Todo, 'id'>) => {
    setTempTodo({
      title, completed, userId, id: 0,
    });

    todosService.createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setLoading(false);
        setTempTodo(null);
        setInputTitle('');
      })
      .catch(() => {
        setErrorLoad('Unable to add a todo');
        setLoading(false);
        setTempTodo(null);
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
      });
  };

  const completedTodos = todos.filter(todo => todo.completed === true);

  const clearCompletedTodos = () => {
    completedTodos.forEach(todo => todosService.deleteTodo(todo.id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          ({ completed }) => completed !== true,
        ));
      })
      .catch(() => {
        setErrorLoad('Unable to delete a todo');
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
      }));
  };

  const deleteTodo = (id:number) => {
    todosService.deleteTodo(id)
      .then(() => setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== id,
      )))
      .catch(() => {
        setErrorLoad('Unable to delete a todo');
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputTitle.trim().length !== 0) {
      setLoading(true);
      addTodo({
        title: inputTitle.trim(),
        completed: false,
        userId: USER_ID,
      });
    } else {
      setErrorLoad('Title should not be empty');
      setTimeout(() => {
        setErrorLoad('');
      }, 3000);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          title={inputTitle}
          setTitle={setInputTitle}
          loading={loading}
          todos={todos}
          errorLoad={errorLoad}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filterTodos}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
            setSortField={setSortField}
            sortField={sortField}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorLoad },
        )}
      >
        <button
          onClick={() => {
            setErrorLoad('');
          }}
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />
        {errorLoad}
      </div>
    </div>
  );
};
