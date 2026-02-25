/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosServices from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import classNames from 'classnames';
import { handleError } from './services/ErrorHandling';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [activeTodo, setActiveTodo] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  const [all, setAll] = useState(true);
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  const loadTodos = async () => {
    try {
      const todosData = await todosServices.getTodos().then(data => data);

      setTodosList(todosData);
    } catch (error) {
      handleError(setErrorType, { type: 'loading', time: Date.now() });
      throw error;
    }
  };

  const todos = useMemo(() => {
    return [...todosList].filter((current: Todo) => {
      if (active) {
        return !current.completed;
      }

      if (completed) {
        return current.completed;
      }

      return current;
    });
  }, [active, completed, todosList]);

  const todosCounter: number = useMemo(() => {
    return [...todosList].filter((todo: Todo) => todo.completed === false)
      .length;
  }, [todosList]);

  const deleteTodo = async (todoId: number) => {
    handleError(setErrorType, null);
    try {
      await todosServices.deleteTodos(todoId);

      return setTodosList(currentTodos => {
        return currentTodos.filter(
          (currentTodo: Todo) => currentTodo.id !== todoId,
        );
      });
    } catch (error) {
      handleError(setErrorType, { type: 'delete', time: Date.now() });
      throw error;
    } finally {
      setActiveTodo([]);
    }
  };

  const completeTodo = (
    todo: Todo,
    activeTodos: Todo[] = [todo],
    state?: boolean,
  ) => {
    const completedTodo: Todo = {
      ...todo,
      completed: state ? state : !todo.completed,
    };

    setActiveTodo([...activeTodos]);

    todosServices
      .updateTodos(completedTodo)
      .then(() => {
        setTodosList(currentTodos => {
          const copiedTodo: Todo[] = [...currentTodos];
          const index: number = copiedTodo.findIndex(
            (current: Todo) => current.id === completedTodo.id,
          );

          copiedTodo.splice(index, 1, completedTodo);

          return copiedTodo;
        });
      })
      .catch((error: Error) => {
        handleError(setErrorType, { type: 'update', time: Date.now() });
        throw error;
      })
      .finally(() => {
        setActiveTodo([]);
      });
  };

  const completeAllTodos = async () => {
    const completedAll: boolean = [...todosList].every((current: Todo) => {
      return current.completed;
    });

    const currentTodos: Todo[] = completedAll
      ? [...todosList]
      : [...todosList].filter(current => !current.completed);

    const promiseArray = currentTodos.map((todo: Todo) =>
      completeTodo(todo, currentTodos, !completedAll),
    );

    try {
      await Promise.all([...promiseArray]);
    } catch (error) {
      handleError(setErrorType, { type: 'update', time: Date.now() });
      throw error;
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!todosServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosList={todosList}
          todosCounter={todosCounter}
          activeTodo={activeTodo}
          setTodosList={setTodosList}
          completeAll={completeAllTodos}
          setErrorType={setErrorType}
          setTempTodo={setTempTodo}
          setActiveTodo={setActiveTodo}
        />

        <TodosList
          todos={todos}
          activeTodo={activeTodo}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          completeTodo={completeTodo}
          setActiveTodo={setActiveTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todosList.length > 0 && (
          <Footer
            todosList={todosList}
            todosCounter={todosCounter}
            all={all}
            active={active}
            completed={completed}
            onDelete={deleteTodo}
            setAll={setAll}
            setActive={setActive}
            setCompleted={setCompleted}
            setActiveTodo={setActiveTodo}
            setErrorType={setErrorType}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorType },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorType(null)}
        />
        {/* show only one message at a time */}
        {errorType?.type === 'loading' && 'Unable to load todos'}
        <br />
        {errorType?.type === 'empty' && 'Title should not be empty'}
        <br />
        {errorType?.type === 'add' && 'Unable to add a todo'}
        <br />
        {errorType?.type === 'delete' && 'Unable to delete a todo'}
        <br />
        {errorType?.type === 'update' && 'Unable to update a todo'}
      </div>
    </div>
  );
};
