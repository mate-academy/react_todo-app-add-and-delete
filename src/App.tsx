import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, TodoStatus } from './types/Todo';
import { getTodos } from './api/todos';
import { filterTodos } from './utils/todoUtil';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 11082;

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterBy, setFilterBy] = useState(TodoStatus.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, filterBy);
  }, [todos, filterBy]);

  const activeTodos = useMemo(() => {
    return filterTodos(todos, TodoStatus.ACTIVE);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          activeTodosQuantity={activeTodos.length}
        />

        <TodoList
          todos={visibleTodos}
          activeTodo={activeTodo}
          setActiveTodo={setActiveTodo}
        />

        {todos.length > 0 && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            activeTodosQuantity={activeTodos.length}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      {isLoading}
    </div>
  );
};
