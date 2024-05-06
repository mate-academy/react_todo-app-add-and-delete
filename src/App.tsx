/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { TodoList } from './Components/TodoList';
import { ErrorNotification } from './Components/ErrorNotification';
import { Footer } from './Components/Footer';
import { Status, Todoo } from './types/Todo';
import { Error } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todoo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Status>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [focus, setFocus] = useState<boolean>(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosData = await getTodos();

        setTodos(todosData);
      } catch (err) {
        setError(true);
        setErrorType('load');
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFocus = () => {
    setFocus(true);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

    setError(true);

    setErrorType('delete');
  };

  const handleToggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleToggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(prev =>
      prev.map(todo => ({
        ...todo,
        completed: !allCompleted,
      })),
    );
  };

  const hideError = () => {
    setError(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedTodo = newTodoTitle.trim();

    if (event.key === 'Enter') {
      event.preventDefault();

      if (trimmedTodo) {
        const newTodo: Todoo = {
          id: todos.length + 1,
          userId: USER_ID,
          title: trimmedTodo,
          completed: false,
        };

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
      } else {
        setError(true);
        setErrorType('empty');
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const onClearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const handleFilterChange = (newFilter: Status) => {
    setFilter(newFilter);
  };

  return (
    <div className="todoapp">
      {!USER_ID && <UserWarning />}
      <h1 className="todoapp__title">todos</h1>
      {USER_ID && (
        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this button should have `active` class only if all todos are completed */}
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllTodos}
            />

            {/* Add a todo on form submit */}
            <form>
              <input
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                onKeyDown={handleKeyDown}
                value={newTodoTitle}
                onChange={handleChange}
                onFocus={handleFocus}
                autoFocus={focus}
              />
            </form>
          </header>

          <TodoList
            todos={todos}
            onDeleteTodo={handleDeleteTodo}
            onToggleTodo={handleToggleTodo}
            filter={filter}
          />

          {/* Hide the footer if there are no todos */}
          {todos.length > 0 && (
            <Footer
              filter={filter}
              todosCount={todos.length}
              completedTodosCount={todos.filter(todo => todo.completed).length}
              onClearCompleted={onClearCompleted}
              handleFilterChange={handleFilterChange}
            />
          )}
        </div>
      )}
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        error={error}
        errorType={errorType}
        hideError={hideError}
      />
    </div>
  );
};
