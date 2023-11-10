/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Error } from './Error';
import { Header } from './Header';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import * as postService from './api/todos';

export const USER_ID = 11894;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearCompletedTodos = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
  };

  const clearError = useCallback(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setErrorMessage]);

  const loadTodos = () => {
    setErrorMessage('');
    postService.getTodos(USER_ID)
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setVisibleTodos(fetchedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        clearError();
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filterById = (filteredTodos: Todo[], id: number) => {
    return filteredTodos.filter(todo => todo.id !== id);
  };

  const addTodo = ({ userId, title, completed }: Todo) => {
    setIsLoading(true);

    const promise = postService.createTodo({
      userId, title: title.trim(), completed,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
        setVisibleTodos(
          currentVisibleTodos => [...currentVisibleTodos, newTodo],
        );
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        clearError();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });

    setTempTodo({
      id: 0, userId: USER_ID, title, completed,
    });

    return promise;
  };

  const deleteTodo = useCallback((todoId: number) => {
    setDeletingTodoId(todoId);
    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => filterById(currentTodos, todoId));
        setVisibleTodos(visTodos => filterById(visTodos, todoId));
        setDeletingTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        clearError(); // Clear the error message after 3 seconds
        setDeletingTodoId(null);
      });
  }, [setTodos, clearError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          isLoading={isLoading}
          userId={USER_ID}
          setErrorMessage={setErrorMessage}
          clearError={clearError}
        />

        {visibleTodos && (
          <TodoList
            tempTodo={tempTodo}
            isLoading={isLoading}
            visibleTodos={visibleTodos}
            deleteTodo={deleteTodo}
            deletingTodoId={deletingTodoId}
          />
        )}

        {(todos.length > 0 || tempTodo) && (
          <Footer
            todos={todos}
            setVisibleTodos={setVisibleTodos}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
