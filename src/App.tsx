/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/errorNotification';
import { Todo } from './types/Todo';
import * as todoApi from './api/todos';
import { FilteringType } from './types/filteringType';
import { USER_ID } from './utils/User_Id';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeOfFiltering, setTypeOfFiltering]
    = useState<string>(FilteringType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoDeletingId, setTodoDeletingId] = useState<number | number[]>(0);

  const errorDeletion = useCallback(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const filteredTodos = [...todos].filter(todo => {
    if (typeOfFiltering) {
      switch (typeOfFiltering) {
        case FilteringType.All:
          return todos;
        case FilteringType.Active:
          return !todo.completed;
        case FilteringType.Completed:
          return todo.completed;
        default:
          return todos;
      }
    }

    return todo;
  });

  const loadTodos = useCallback(async () => {
    try {
      const todosData = await todoApi.getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      errorDeletion();
    }
  }, [setTodos, setErrorMessage, errorDeletion]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  async function addTodo(
    {
      title, completed, id, userId,
    }: Todo,
  ): Promise<{ isError: boolean } | undefined> {
    let isError = false;

    setIsDisabledInput(true);
    setTempTodo({
      title, completed, id: 0, userId,
    });

    try {
      const createTodo = await todoApi.createTodo(
        {
          title, completed, id, userId,
        },
      );

      setTodos(currentTodos => [...currentTodos, createTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      errorDeletion();
      isError = true;
    } finally {
      setIsDisabledInput(false);
      setTempTodo(null);
    }

    if (isError) {
      return { isError };
    }

    return undefined;
  }

  async function deleteTodo(id: number | number[]) {
    if (Array.isArray(id)) {
      id.forEach(idCompleted => {
        setTodoDeletingId(idCompleted);
      });
    } else {
      setTodoDeletingId(id);
    }

    try {
      if (Array.isArray(id)) {
        await id.forEach(idCompleted => {
          todoApi.deleteTodos(idCompleted);
        });
      } else {
        todoApi.deleteTodos(id);
      }

      if (Array.isArray(id)) {
        id.forEach(idCompleted => {
          setTodos(
            currentList => currentList.filter(todo => todo.id !== idCompleted),
          );
        });
      } else {
        setTodos(currentList => currentList.filter(todo => todo.id !== id));
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
      errorDeletion();
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorMessage={setErrorMessage}
          // eslint-disable-next-line
          onSubmit={addTodo}
          setIsDisabledInput={setIsDisabledInput}
          isDisabledInput={isDisabledInput}
          errorDeletion={errorDeletion}
        />

        {todos.length > 0
          && (
            <TodoList
              todos={filteredTodos}
              // eslint-disable-next-line
              onDeleteTodo={deleteTodo}
              tempTodo={tempTodo}
              todoDeletingId={todoDeletingId}
            />
          )}

        {todos.length > 0
          && (
            <Footer
              setTypeOfFiltering={setTypeOfFiltering}
              typeOfFiltering={typeOfFiltering}
              todos={todos}
              // eslint-disable-next-line
              deleteTodo={deleteTodo}
            />
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
