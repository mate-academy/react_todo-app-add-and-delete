import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { HeaderTodoApp } from './components/HeaderTodoApp';
import { MainTodoApp } from './components/MainTodoApp';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FooterTodoApp } from './components/FooterTodoApp';
import { Category } from './types/Category';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [category, setCategory] = useState<Category>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isEmpty, setIsEmplty] = useState(false);
  const [errorGetTodos, setErrorGetTodos] = useState(false);

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setErrorGetTodos(true);
      setTimeout(() => {
        setErrorGetTodos(false);
      }, 5000);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [todos, tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodoApp
          todos={todos}
          USER_ID={USER_ID}
          setTempTodo={setTempTodo}
          setIsEmplty={setIsEmplty}
        />
        {todos.length > 0 && (
          <MainTodoApp
            todos={todos}
            category={category}
            tempTodo={tempTodo}
            setTempTodo={setTempTodo}
          />
        )}
        {todos.length > 0 && (
          <FooterTodoApp
            todos={todos}
            category={category}
            setCategory={setCategory}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {(isEmpty || errorGetTodos) && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {/* eslint-disable jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={() => {
              setIsEmplty(false);
              setErrorGetTodos(false);
            }}
          />

          {/* show only one message at a time */}
          {errorGetTodos && "Don't found server"}
          {false && 'Unable to add a todo'}
          {false && 'Unable to delete a todo'}
          {false && 'Unable to update a todo'}
          {isEmpty && "Title can't be empty"}
        </div>
      )}
    </div>
  );
};
