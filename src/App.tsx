/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoRow } from './components/TodoRow';
import { USER_ID } from './utils/preferences';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const temp: Todo = { id: 0, title, completed: false, userId: USER_ID };

    setTempTodo(temp);
    setIsAdding(true);

    try {
      const created = await todoService.createTodo(title);

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const deleteTodo = async (todo: Todo) => {
    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, isLoading: true } : t)),
    );
    try {
      await todoService.deleteTodo(todo.id);
      setTodos(prev => prev.filter(t => t.id !== todo.id));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, isLoading: false } : t)),
      );
      setErrorMessage('Unable to delete a todo');
    }
  };

  const renameTodo = async (todo: Todo, newTitleParam: string) => {
    if (newTitle.trim() === todo.title) {
      return;
    }

    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, isLoading: true } : t)),
    );
    try {
      const updated = await todoService.updateTodo({
        ...todo,
        title: newTitleParam.trim(),
      });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, isLoading: false } : t)),
      );
      setErrorMessage('Unable to rename a todo');
    }
  };

  const toggleTodo = async (todo: Todo) => {
    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, isLoading: true } : t)),
    );
    try {
      const updated = await todoService.updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, isLoading: false } : t)),
      );
      setErrorMessage('Unable to toggle a todo');
    }
  };

  const toggleAll = async () => {
    const allCompleted = todos.every(t => t.completed);
    const todosToToggle = todos.filter(t => t.completed === allCompleted);

    await Promise.all(todosToToggle.map(todo => toggleTodo(todo)));
  };

  const clearCompletedTodos = async () => {
    const completed = todos.filter(t => t.completed);

    await Promise.allSettled(completed.map(t => deleteTodo(t)));
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && todos.every(t => t.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={toggleAll}
          />

          <form onSubmit={addTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoRow
              key={todo.id}
              todo={todo}
              isLoading={todo.isLoading || false}
              onDelete={() => deleteTodo(todo)}
              onRename={title => renameTodo(todo, title)}
              onToggle={() => toggleTodo(todo)}
            />
          ))}
          {tempTodo && <TodoRow todo={tempTodo} isLoading={true} />}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                onClick={() => setFilter('all')}
                data-cy="FilterLinkAll"
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                onClick={() => setFilter('active')}
                data-cy="FilterLinkActive"
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                onClick={() => setFilter('completed')}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
              onClick={clearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
