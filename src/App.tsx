/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Error } from './types/Error';
import { FilteredState } from './types/FilteredState';
import { TempTodo } from './types/TempTodo';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6249;

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredState, setFilteredState] = useState(FilteredState.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const getTodosFromServer = async () => {
    if (!USER_ID) {
      return;
    }

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (err) {
      setErrorMessage(Error.error);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const postTodosToServer = async (title: string) => {
    setIsLoading(true);
    setTempTodo({ id: 0, title, completed: false });
    try {
      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };
      const postedTodo = await (postTodos(newTodo));

      setTodos(current => [...current, postedTodo]);
    } catch (err) {
      setErrorMessage(Error.addTodoError);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setDeletingTodoId(todoId);

      await deleteTodos(todoId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(Error.deleteTodoError);
    } finally {
      setDeletingTodoId(null);
    }
  };

  const updateTodo = (todoToUpdate: Todo) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === todoToUpdate.id) {
          return todoToUpdate;
        }

        return todo;
      }),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onIsLoading={isLoading}
          onTodoTitle={todoTitle}
          onSetTodoTitle={setTodoTitle}
          setError={setErrorMessage}
          onPostTodoFromServer={postTodosToServer}
        />
        <Main
          todos={todos}
          filterBy={filteredState}
          deleteTodosFromServer={deleteTodo}
          updateTodo={updateTodo}
          tempTodo={tempTodo}
          isloading={isLoading}
          deletingTodoId={deletingTodoId}
        />
        {todos.length > 0 && (
          <Footer
            OnFilteredState={filteredState}
            onSetFilteredState={setFilteredState}
            todos={todos}
            onDeleteTodo={deleteTodo}
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
