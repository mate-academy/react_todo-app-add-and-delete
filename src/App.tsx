/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { Filter } from './types/Filter';
import { Footer } from './components/Footer';

interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  onDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the
                  todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  onDelete,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          isLoading={true}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoFieldRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    } else if (filter === Filter.Completed) {
      return todo.completed;
    } else {
      return true;
    }
  });

  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const removeTodo = (todoId: number) => {
    setErrorMessage('');
    setLoadingIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const clearCompleted = (completedTodosIds: number[]) => {
    for (const id of completedTodosIds) {
      removeTodo(id);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    const validQuery = query.trim();

    if (validQuery.length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: validQuery,
      completed: false,
    };

    setTempTodo(todo);

    addTodo({ userId: USER_ID, title: validQuery, completed: false })
      .then(result => {
        setTodos(prev => [...prev, result]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(result => setTodos(result))
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isSubmitting && loadingIds.length === 0) {
      todoFieldRef.current?.focus();
    }
  }, [isSubmitting, loadingIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: isAllCompleted })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={event => handleSubmit(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
              disabled={isSubmitting}
              ref={todoFieldRef}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={removeTodo}
              loadingIds={loadingIds}
            />

            <Footer
              activeTodos={activeTodos}
              filter={filter}
              onClick={setFilter}
              hasCompleted={hasCompleted}
              completedTodosIds={completedIds}
              onClearCompleted={clearCompleted}
            />
          </>
        )}

        {/* Hide the footer if there are no todos */}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
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
        Unable to add a todo``
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
