/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { ErrorsNotification } from './components/ErrorsNotification';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import {
  addTodo, deleteTodo, loadTodosFromServer, prepareTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';

export const USER_ID = 6391;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [,setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Filter>(Filter.ALL);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);

  useEffect(() => {
    loadTodosFromServer(USER_ID, setTodos, setErrorType);
  }, []);

  const visibleTodos = prepareTodo(status, todos);

  const changeTitle = (newTitle: string) => {
    setTodoTitle(newTitle);
  };

  const onFormSubmit = async () => {
    if (!todoTitle.length) {
      setErrorType(ErrorType.EMPTY_TITLE);
    }

    if (todoTitle.length) {
      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        const todoFromServer = await addTodo(USER_ID, newTodo);

        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        setTempTodo(null);
        setTodoTitle('');
      } catch (error) {
        setErrorType(ErrorType.ADD);
      }
    }
  };

  const deleteTodos = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos((prevTodos: Todo[]): Todo[] => {
        return prevTodos.filter(item => item.id !== todoId);
      });
    } catch (error) {
      setErrorType(ErrorType.DELETE);
    }
  };

  const clearCompleted = async () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
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
          onFormSubmit={onFormSubmit}
          title={todoTitle}
          todos={todos}
          onTitleChange={changeTitle}
        />

        <TodoList
          todos={visibleTodos}
          onTodoDelete={deleteTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            status={status}
            onStatusChange={setStatus}
            todos={visibleTodos}
            onTodoDelete={clearCompleted}
          />
        )}
      </div>
      {errorType !== ErrorType.NONE
        && <ErrorsNotification errorType={errorType} />}
    </div>
  );
};
