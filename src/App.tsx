/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoFooter } from './components/TodoFooter/TodoFooter';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };
    const tempTodoData: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(tempTodoData);

    addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        setTempTodo(null);
        setNewTodoTitle('');
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDelete = async (todoId: number) => {
    setDeletingTodoId(todoId);
    inputRef.current?.focus();

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingTodoId(null);

      await new Promise(resolve => setTimeout(resolve, 0));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const deletedIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedIds.includes(todo.id)),
    );

    if (results.some(result => result.status === 'rejected')) {
      setErrorMessage('Unable to delete a todo');
    }

    await new Promise(resolve => setTimeout(resolve, 0));
    inputRef.current?.focus();
  };

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
              disabled={tempTodo !== null}
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={deletingTodoId === todo.id}
                onDelete={handleDelete}
              />
            ))}
            {tempTodo !== null && (
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                isLoading={true}
                onDelete={handleDelete}
              />
            )}
          </section>
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
