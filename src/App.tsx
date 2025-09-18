/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

// API & Constants
import { USER_ID } from './api/todos';
import { addTodo } from './services/addTodo';
import { fetchTodos } from './services/fetchTodos';
import { removeTodo } from './services/removeTodo';
import { changeTodoStatus } from './services/changeTodoStatus';
import { dissmissErrorTimer } from './services/dismissErrorTimer';

// Types
import { Todo } from './Types/Todo';

// Components
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [todoTitile, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const activeTaskCount = todosList.filter(todo => !todo.completed).length;

  useEffect(() => {
    fetchTodos(setTodosList, setError);
  }, []);

  useEffect(() => {
    dissmissErrorTimer(error, setError);
  }, [error]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo(
      USER_ID,
      todoTitile,
      setIsLoading,
      setError,
      setTodosList,
      setTempTodo,
      setTodoTitle,
    );
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTodoTitle(event.target.value);

  const handleStatusChange = (id: number, completed: boolean) =>
    changeTodoStatus(id, completed, setTodosList, setError);

  const handleDeleteTodo = (id: number, isTemp: boolean) =>
    removeTodo(id, isTemp, setTodosList, setError);

  const handleDismissError = () => {
    setError(null);
    fetchTodos(setTodosList, setError);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoTitle={todoTitile}
          isLoading={isLoading}
          onChangeTitle={handleChangeTitle}
          onSubmit={handleSubmit}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {todosList.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              filter={filter}
              onStatusChange={handleStatusChange}
              onDeleteTodo={handleDeleteTodo}
              isTemp={false}
            />
          ))}

          {tempTodo && (
            <TodoItem
              key="temp"
              todo={tempTodo}
              onStatusChange={handleStatusChange}
              isTemp
            />
          )}
        </section>

        {todosList.length !== 0 && (
          <Footer
            filter={filter}
            activeTaskCount={activeTaskCount}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification error={error} dismissError={handleDismissError} />
    </div>
  );
};
