/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
// import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';

const USER_ID = 12037;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState('all');
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NULL);
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);

  useEffect(
    () => {
      todosService.getTodos(USER_ID)
        .then(setTodos)
        .catch(() => setErrorMessage(Errors.LOAD))
        .finally(() => setTimeout(() => setErrorMessage(Errors.NULL), 3000));
    }, [],
  );

  const todosToRender = useMemo(
    () => {
      return todos.filter(todo => {
        return filterValue === 'all'
          || (filterValue === 'completed' ? todo.completed : !todo.completed);
      });
    },
    [todos, filterValue],
  );

  const addTodo = async (inputValue: string) => {
    const data = {
      id: 0,
      title: inputValue,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(data);

    try {
      const createdTodo = await todosService.createTodo(data);

      return (
        setTodos(currentTodos => [...currentTodos, createdTodo]));
    } catch (error) {
      setErrorMessage(Errors.ADD);
      throw error;
    } finally {
      setTimeout(() => setErrorMessage(Errors.NULL), 3000);
      setTempTodo(null);
    }
  };

  const updateTodo = async (todoToUpdate: Todo) => {
    try {
      const updatedTodo = await todosService
        .updateTodo(todoToUpdate.id, todoToUpdate);

      setTodos(currentTodos => {
        const newTodos = [...currentTodos];

        const findIndexTodo = [...todos].findIndex(
          todo => todo.id === todoToUpdate.id,
        );

        newTodos.splice(findIndexTodo, 1, updatedTodo);

        return newTodos;
      });
    } catch (error) {
      setErrorMessage(Errors.UPDATE);
      throw error;
    } finally {
      setTimeout(() => setErrorMessage(Errors.NULL), 3000);
    }
  };

  const deleteTodo = (todoId: number) => {
    todosService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => setErrorMessage(Errors.DELETE))
      .finally(() => {
        setTimeout(() => setErrorMessage(Errors.NULL), 3000);
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
          updateTodo={updateTodo}
          todos={todos}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={todosToRender}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todosToRender}
            setFilterValue={setFilterValue}
            filterValue={filterValue}
          />
        )}
      </div>

      {errorMessage && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            type="button"
            className={cn('delete', {
              hidden: !errorMessage,
            })}
            onClick={() => {
              setErrorMessage(Errors.NULL);
            }}
          />
          {errorMessage}
        </div>

      )}
    </div>
  );
};
