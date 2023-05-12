import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { HeaderTodoApp } from './components/HeaderTodoApp';
import { MainTodoApp } from './components/MainTodoApp';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FooterTodoApp } from './components/FooterTodoApp';
import { Category } from './types/Category';
import { ErrorComponent } from './components/ErrorComponent';

const USER_ID = 10299;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [category, setCategory] = useState<Category>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');

  const loadTodos = async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
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
          setError={setError}
        />
        {todos.length > 0 && (
          <MainTodoApp
            todos={todos}
            category={category}
            tempTodo={tempTodo}
            setTempTodo={setTempTodo}
            setError={setError}
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

      {error && (
        <ErrorComponent error={error} setError={setError} />
      )}
    </div>
  );
};
