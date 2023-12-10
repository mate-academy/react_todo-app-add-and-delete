/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { USER_ID } from './helpers/userId';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import * as todoService from './api/todos';
import { ErrorMessages } from './components/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setIsError(true);
      });
  }, []);

  const addTodo = ({ userId, title, completed }: Todo) => {
    if (!todoTitle.trim()) {
      setIsError(true);
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    setResponse(true);

    todoService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodoTitle('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setResponse(false);
      });
  };

  const deleteTodo = (id: number) => {
    setIsLoading((currentTodos => [...currentTodos, id]));

    todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setIsLoading(currentTodos => currentTodos.filter(todoId => id !== todoId));
        setTempTodo(null);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isTodosLength = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          response={response}
          setIsError={setIsError}
        />

        {isTodosLength && (
          <>
            <TodoList
              todos={filteredTodos}
              onDelete={deleteTodo}
              isLoading={isLoading}
              tempTodo={tempTodo}
            />

            <Footer
              todos={todos}
              setFilteredTodos={setFilteredTodos}
              onDelete={deleteTodo}
            />
          </>
        )}

      </div>

      <ErrorMessages
        errorMessage={errorMessage}
        isError={isError}
        setIsError={setIsError}
      />
    </div>
  );
};
