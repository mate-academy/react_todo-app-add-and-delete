/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos, removeTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import TodoList from './Components/TodoList';
import TempTodo from './Components/TempTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [requestMethod, setRequestMethod] = useState<
    'GET' | 'POST' | 'UPDATE' | 'DELETE' | null
  >(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState<string>('');
  const completedTodos: Todo[] = [...todos].filter(t => t.completed);

  const activeTodos: Todo[] = [...todos].filter(t => !t.completed);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim().length === 0) {
      handleError('Title should not be empty');

      return;
    }

    setLoading(true);
    setRequestMethod('POST');

    setTempTodo({
      title: title.trim(),
      completed: false,
      id: todos.length + 1,
      userId: 0,
    });
    inputRef.current?.setAttribute('disabled', 'true');

    try {
      const newTodo = await addTodo({ title: title.trim(), completed: false });

      setTodos([...todos, newTodo]);
      setTitle('');
      setTempTodo(null);
    } catch (error) {
      handleError('Unable to add a todo');
      setTempTodo(null);
    }

    inputRef.current?.removeAttribute('disabled');
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleDelete = async (todoId: number) => {
    setLoading(true);
    setRequestMethod('DELETE');

    try {
      await removeTodo(todoId);

      setTodos(prev => prev.filter(item => item.id !== todoId));
      setLoading(false);
      setRequestMethod(null);
    } catch (error) {
      handleError('Unable to delete a todo');
    }

    inputRef.current?.focus();
  };

  const handleGroupDelete = () => {
    const completedTodoItemList = [...completedTodos];

    completedTodoItemList.forEach(async t => {
      try {
        await removeTodo(t.id);
        setTodos(prev => prev.filter(item => item.id !== t.id));
        inputRef.current?.focus();
      } catch (error) {
        handleError('Unable to delete a todo');
      }
    });
  };

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setRequestMethod('GET');
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      setLoading(false);
      setRequestMethod(null);
    };

    inputRef.current?.focus();

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChangeTitle}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          setSelectedTodoId={setSelectedTodoId}
          handleDelete={handleDelete}
          loading={loading}
          requestMethod={requestMethod}
          selectedTodoId={selectedTodoId}
          filter={filter}
        />
        {tempTodo && (
          <TempTodo
            tempTodo={tempTodo}
            loading={loading}
            requestMethod={requestMethod}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'All' ? 'selected' : ''} `}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'Active' ? 'selected' : ''} `}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'Completed' ? 'selected' : ''} `}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={handleGroupDelete}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage.length === 0 ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
