/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Filter } from './utils/Filter';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo } from './api/todos';
import { Errors } from './utils/Errors';
import { Loader } from './components/Loader';

const USER_ID = 9934;

const visibleTodos = (todos: Todo[], selectedFilter: Filter) => {
  switch (selectedFilter) {
    case Filter.Active:
      return todos.filter((todo) => !todo.completed);
    case Filter.Completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState(Errors.NoError);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.Updating))
      .finally(() => setIsLoading(false));
  }, []);

  const onDelete = (todoId: number) => {
    setIsLoading(true);
    deleteTodo(USER_ID, todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => setError(Errors.Deleting))
      .finally(() => setIsLoading(false));
  };

  const onClearCompleted = () => {
    setIsLoading(true);
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(completedTodoIds.map(id => deleteTodo(USER_ID, id)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => setError(Errors.Deleting))
      .finally(() => setIsLoading(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodoItems = visibleTodos(todos, selectedFilter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodos}
          todos={todos}
          setError={setError}
          isLoading={isLoading}
        />

        {isLoading ? <Loader />
          : (
            <TodoList
              todos={visibleTodoItems}
              onDelete={onDelete}
            />
          )}

        {(!!todos.length) && (
          <Footer
            visibleTodos={visibleTodoItems}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      {error && <Notification message={error} />}
    </div>
  );
};
