/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const;

type Filter = (typeof FILTERS)[keyof typeof FILTERS];

type NewTodoFormProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  onAdd: () => void;
  disabled: boolean;
};

const NewTodoForm: React.FC<NewTodoFormProps> = ({
  inputRef,
  onAdd,
  disabled,
}) => (
  <form>
    <input
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      autoFocus
      ref={inputRef}
      disabled={disabled}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onAdd();
        }
      }}
    />
  </form>
);

type TodoItemProps = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, isLoading, onDelete }) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        disabled
        readOnly
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    {onDelete && (
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    )}

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);

type TodoListProps = {
  todos: Todo[];
  processingIds: number[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  processingIds,
  tempTodo,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={processingIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isLoading />}
  </section>
);

type TodoFooterProps = {
  activeTodosCount: number;
  filter: Filter;
  onFilterChange: (filterValue: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodosCount,
  filter,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FILTERS.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(FILTERS.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FILTERS.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(FILTERS.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FILTERS.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(FILTERS.completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompleted}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(FILTERS.all);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));

    inputRef.current?.focus();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasTodos = todos.length > 0;
  const hasCompleted = todos.some(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const filteredTodos = todos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const addNewTodo = async () => {
    setErrorMessage('');

    const value = inputRef.current?.value.trim();

    if (!value) {
      setErrorMessage('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const creatingTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: value,
      completed: false,
    };

    setTempTodo(creatingTodo);
    setIsAdding(true);

    try {
      const savedTodo = await addTodo({
        userId: USER_ID,
        title: value,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, savedTodo]);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const removeTodo = async (id: number) => {
    setErrorMessage('');
    setProcessingIds(prevIds => Array.from(new Set([...prevIds, id])));

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setProcessingIds(prevIds =>
        prevIds.filter(processingId => processingId !== id),
      );
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const clearCompleted = async () => {
    setErrorMessage('');

    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(prevIds =>
      Array.from(new Set([...prevIds, ...completedIds])),
    );

    const deleteResults = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const failedIds = completedIds.filter(
      (_, index) => deleteResults[index].status === 'rejected',
    );

    setTodos(prevTodos =>
      prevTodos.filter(todo => {
        if (!todo.completed) {
          return true;
        }

        return failedIds.includes(todo.id);
      }),
    );

    if (failedIds.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setProcessingIds(prevIds =>
      prevIds.filter(processingId => !completedIds.includes(processingId)),
    );
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodoForm
            inputRef={inputRef}
            onAdd={addNewTodo}
            disabled={isAdding}
          />
        </header>

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            processingIds={processingIds}
            tempTodo={tempTodo}
            onDelete={removeTodo}
          />
        )}

        {hasTodos && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
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
