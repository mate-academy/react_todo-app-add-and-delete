import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Errors } from './types/Errors';
import { FilterValue } from './types/FilterValue';
import { ErrorNotification } from './components/ErrorNotification';
// import {handleError, setErrorMessage} from "./helpers";

const USER_ID = 12037;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(FilterValue.All);
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Null);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(
    () => {
      todosService.getTodos(USER_ID)
        .then(setTodos)
        .catch(() => setErrorMessage(Errors.LoadTodos))
        .finally(() => setTimeout(() => setErrorMessage(Errors.Null), 3000));
    }, [],
  );

  const todosToRender = useMemo(
    () => {
      return todos.filter(todo => {
        return filterValue === FilterValue.All
          || (filterValue === FilterValue.Completed
            ? todo.completed : !todo.completed);
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
      setErrorMessage(Errors.AddTodo);
      throw error;
    } finally {
      setTimeout(() => setErrorMessage(Errors.Null), 3000);
      setTempTodo(null);
    }
  };

  const updateTodo = async (todoToUpdate: Todo) => {
    try {
      setShowLoader(true);
      const updatedTodo = await todosService.updateTodo(
        todoToUpdate.id,
        todoToUpdate,
      );

      setTodos((currentTodos) => {
        return currentTodos
          .map((todo) => (todo.id === todoToUpdate.id ? updatedTodo : todo));
      });
    } catch (error) {
      setErrorMessage(Errors.UpdateTodo);
      throw error;
    } finally {
      setShowLoader(false);
      setTimeout(() => setErrorMessage(Errors.Null), 3000);
    }
  };

  const deleteTodo = (todoId: number) => {
    setShowLoader(true);
    todosService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => setErrorMessage(Errors.DeleteTodo))
      .finally(() => {
        setShowLoader(false);
        setTimeout(() => setErrorMessage(Errors.Null), 3000);
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
          showLoader={showLoader}
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
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
