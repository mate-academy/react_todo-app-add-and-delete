/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, postTodo } from './api/todos';
import { TodoList } from './Components/TodoList';
import { ErrorNotification } from './Components/ErrorNotification';
import { Footer } from './Components/Footer';
import { Status, Todo } from './types/Todo';
import { Error } from './types/Todo';
import { TodoItem } from './Components/TodoItem';
import { deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Status>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [focus, setFocus] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [addNewTodo, setAddNewTodo] = useState<boolean>(false);
  const [loadingAddTodoId, setLoadingAddTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (focus) {
      const inputField = document.querySelector(
        '.todoapp__new-todo',
      ) as HTMLElement;

      if (inputField) {
        inputField.focus();
      }
    }
  }, [focus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const trimmedTodo = newTodoTitle.trim();

    if (event.key === 'Enter') {
      event.preventDefault();

      if (trimmedTodo) {
        setFocus(false);

        try {
          setAddNewTodo(true);

          const newTodo: Todo = {
            id: 0,
            userId: USER_ID,
            title: trimmedTodo,
            completed: false,
          };
          const response = await postTodo(newTodo);

          setLoadingAddTodoId(response.id);

          setTodos(prevTodos => [...prevTodos, response]);
          setNewTodoTitle('');
          setTempTodo(null);
          setAddNewTodo(false);

          setLoadingAddTodoId(null);
          setFocus(true);
        } catch (err) {
          setError(true);
          setErrorType('add');
          setAddNewTodo(false);
        }
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

  const handleDeleteTodo = async (id: number) => {
    setLoading(true);
    setLoadingTodoId(id);
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      setError(true);
      setErrorType('delete');
    } finally {
      setLoading(false);
      setLoadingTodoId(null);
    }
  };

  const handleToggleTodo = async (id: number) => {
    setLoading(true);
    setLoadingTodoId(id);
    try {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
      await deleteTodo(id);
      setLoading(false);
      setLoadingTodoId(null);
    } catch (err) {
      setError(true);
      setErrorType('delete');
    }
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
                ref={inputRef}
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                onKeyDown={handleKeyDown}
                value={newTodoTitle}
                onChange={handleChange}
                autoFocus
                disabled={!focus}
              />
            </form>
          </header>
          <TodoList
            todos={todos}
            onToggleTodo={handleToggleTodo}
            filter={filter}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setErrorType={setErrorType}
            handleDeleteTodo={handleDeleteTodo}
            loadingTodoId={loadingTodoId}
            loadingAddTodoId={loadingAddTodoId}
            addNewTodo={addNewTodo}
            setFocus={setFocus}
            setLoadingTodoId={setLoadingTodoId}
          />
          {tempTodo && (
            <div className="todoapp__temp-todo">
              <TodoItem
                key={tempTodo.id}
                id={tempTodo.id}
                title={tempTodo.title}
                completed={tempTodo.completed}
                onToggle={() => {}}
                setLoading={setLoading}
                setError={setError}
                setErrorType={setErrorType}
                onDelete={() => handleDeleteTodo(tempTodo.id)}
                loadingTodoId={loadingTodoId}
                loadingAddTodoId={loadingAddTodoId}
                setFocus={setFocus}
                setLoadingTodoId={setLoadingTodoId}
              />
            </div>
          )}
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
