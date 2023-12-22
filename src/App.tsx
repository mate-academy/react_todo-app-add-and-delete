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

const USER_ID = 12037;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(FilterValue.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const handleError = (error: Errors) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(error), 3000);
  };

  useEffect(
    () => {
      todosService.getTodos(USER_ID)
        .then(setTodos)
        .catch(() => handleError(Errors.LoadTodos))
        .finally(() => handleError(Errors.Null));
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
      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch (e) {
      handleError(Errors.AddTodo);
    } finally {
      handleError(Errors.Null);
      setTempTodo(null);
    }
  };

  const updateTodo = (todoToUpdate: Todo) => {
    todosService
      .updateTodo(todoToUpdate.id, todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos
            .map(todo => (todo.id === todoToUpdate.id ? updatedTodo : todo));
        });
      })
      .catch(() => {
        handleError(Errors.UpdateTodo);
      })
      .finally(() => {
        handleError(Errors.Null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId([todoId]);
    todosService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => handleError(Errors.DeleteTodo))
      .finally(() => {
        handleError(Errors.Null);
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
          handleError={handleError}
        />

        <TodoList
          todos={todosToRender}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          loadingTodoId={loadingTodoId}
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
