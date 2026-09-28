/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { TodoItem } from './components/Todo/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorTodoMessage, setErrorTodoMessage] = useState<string>('');
  const [filterTodos, setFilterTodos] = useState<Filter>('all');
  // ADD TODO
  const [newTitleTodo, setNewTitleTodo] = useState<string>(''); // for input value
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // DELETE TODO
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorTodoMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorTodoMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorTodoMessage) {
      const timerId = setTimeout(() => {
        setErrorTodoMessage('');
      }, 3000);

      return () => clearTimeout(timerId);
    } else {
      return undefined;
    }
  }, [errorTodoMessage]);

  useEffect(() => {
    if (!isAdding && deletingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isAdding, deletingTodoIds.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const countActiveTodos = todos.filter(todo => !todo.completed).length;

  // CLEAR COMPLETED TODOS BUTTON
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filterTodos === 'active') {
      return !todo.completed;
    }

    if (filterTodos === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // HANDLE FUNCTION

  const handleDeleteNotification = () => {
    setErrorTodoMessage('');
  };

  const handleFilterTodos = (filter: Filter) => {
    setFilterTodos(filter);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorTodoMessage('');
    if (newTitleTodo.trim().length === 0) {
      return setErrorTodoMessage('Title should not be empty');
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitleTodo.trim(),
      completed: false,
    });

    const todoData = {
      userId: USER_ID,
      title: newTitleTodo.trim(),
      completed: false,
    };

    addTodo(todoData)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTitleTodo('');
      })
      .catch(() => setErrorTodoMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setErrorTodoMessage('');
    setDeletingTodoIds(currentIds => [...currentIds, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorTodoMessage('Unable to delete a todo'))
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
      });
  };

  const handleClearCompleted = () =>
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });

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
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitleTodo}
              onChange={event => setNewTitleTodo(event.target.value)}
              disabled={isAdding}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeleteTodo}
            deletingTodoIds={deletingTodoIds}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} isLoading={isAdding} />}

        {todos.length > 0 && (
          <Footer
            onFilterChange={handleFilterTodos}
            filterTodos={filterTodos}
            countActiveTodos={countActiveTodos}
            hasCompletedTodos={hasCompletedTodos}
            onDelete={handleClearCompleted}
          />
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorTodoMessage.length ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleDeleteNotification}
        />
        {/* show only one message at a time */}
        {errorTodoMessage}
        {/* <br />
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
