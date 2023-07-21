/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import * as todoServise from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const USER_ID = 11092;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosFilterBy, setTodosFilterBy] = useState<Status>(Status.ALL);

  useEffect(() => {
    todoServise.getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setIsError(true);
        throw error;
      });
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await todoServise.createTodo(newTodo);

      setTodos(currTodos => [...currTodos, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, [USER_ID, todos]);

  const deleteTodo = (todoId: number) => {
    setTodos(currTodo => currTodo.filter(todo => todo.id !== todoId));

    return todoServise.delTodos(todoId)
      .catch((err) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw err;
      });
  };

  const preparedTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (todosFilterBy) {
        case Status.ACTIVE:
          return !todo.completed;

        case Status.COMPLETED:
          return todo.completed;

        case Status.ALL:
        default:
          return todos;
      }
    });
  }, [todosFilterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
        />

        <section className="todoapp__main">
          <TodoList
            preparedTodos={preparedTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
          />
        </section>

        {!!todos.length && (
          <Footer
            todos={todos}
            selectItem={todosFilterBy}
            setSelectItem={setTodosFilterBy}
          />
        )}
      </div>

      {isError && errorMessage && (
        <div
          className={classNames(
            'notification',
            'is-danger is-light',
            'has-text-weight-normal', {
              hidden: !isError,
            },
          )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />
          Unable to load todos
        </div>
      )}

    </div>
  );
};
