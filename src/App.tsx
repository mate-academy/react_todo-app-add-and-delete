import React, { useState, useEffect, useRef, useCallback } from 'react';

// API base URL
const API_URL = 'https://react-for-the-first-time.web.app/todos';
const USER_ID = 9323;

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const UserWarning: React.FC = () => (
  <section className="section">
    <p className="box is-size-3">
      Please get your <b> userId </b>{' '}
      <a href="https://mate-academy.github.io/react_student-registration">
        here
      </a>{' '}
      and save it in the app <pre>const USER_ID = ...</pre>
      All requests to the API must be sent with this
      <b> userId.</b>
    </p>
  </section>
);

interface NotificationProps {
  message: string | null;
  type?: 'is-danger' | 'is-success' | 'is-warning';
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'is-danger',
}) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`notification ${type} is-light has-text-weight-normal`}>
      {message}
    </div>
  );
};

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isProcessing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  isProcessing,
}) => {
  return (
    <div className={`todo-item ${todo.id === 0 ? 'temp' : ''}`}>
      {/* Loader for individual todo operations */}
      {isProcessing && (
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-content">
            <div className="box has-text-centered">
              <div className="loader" />
            </div>
          </div>
        </div>
      )}

      <label className="checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => {
            /* Toggle not implemented yet */
          }}
        />
        {todo.title}
      </label>

      {/* Delete button */}
      <button
        type="button"
        className="delete"
        onClick={() => onDelete(todo.id)}
        disabled={isProcessing}
      ></button>
    </div>
  );
};

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  processingTodos: Set<number>;
  onDeleteTodo: (todoId: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  processingTodos,
  onDeleteTodo,
}) => {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          isProcessing={processingTodos.has(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={() => {}}
          isProcessing={true}
        />
      )}
    </div>
  );
};

interface TodoFormProps {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  onAddTodo: (event: React.FormEvent) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const TodoForm: React.FC<TodoFormProps> = ({
  newTodoTitle,
  setNewTodoTitle,
  onAddTodo,
  isDisabled,
  inputRef,
}) => {
  return (
    <form onSubmit={onAddTodo}>
      <input
        type="text"
        className="input new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={event => setNewTodoTitle(event.target.value)}
        disabled={isDisabled}
        ref={inputRef}
      />
    </form>
  );
};

interface FooterProps {
  todos: Todo[];
  onClearCompleted: () => void;
  isProcessingAny: boolean;
}

const Footer: React.FC<FooterProps> = ({
  todos,
  onClearCompleted,
  isProcessingAny,
}) => {
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const itemsLeft = todos.length - completedTodosCount;

  return (
    <footer className="todo-app__footer">
      <span className="todo-count">{itemsLeft} items left</span>

      <ul className="filters">
        <li>
          <a href="#/" className="selected">
            All
          </a>
        </li>{' '}
        {/* Not implemented */}
        <li>
          <a href="#/active">Active</a>
        </li>{' '}
        {/* Not implemented */}
        <li>
          <a href="#/completed">Completed</a>
        </li>{' '}
        {/* Not implemented */}
      </ul>

      <button
        type="button"
        className="clear-completed"
        onClick={onClearCompleted}
        disabled={completedTodosCount === 0 || isProcessingAny}
      >
        Clear completed
      </button>
    </footer>
  );
};

// Main App component
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  // For individual delete loaders
  const [processingTodos, setProcessingTodos] = useState<Set<number>>(
    new Set(),
  );
  const [notification, setNotification] = useState<string | null>(null);
  const notificationTimeoutId = useRef<number | null>(null);

  const newTodoInputRef = useRef<HTMLInputElement>(null);

  // Function to show notifications
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    if (notificationTimeoutId.current) {
      clearTimeout(notificationTimeoutId.current);
    }

    notificationTimeoutId.current = window.setTimeout(() => {
      setNotification(null);
      notificationTimeoutId.current = null;
    }, 3000); // Notification disappears after 3 seconds
  }, []);

  // Effect to focus the new todo input field
  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [loading, todos.length]); // Re-focus after loading or adding a todo

  // Effect to load todos on component mount
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    fetch(`${API_URL}?userId=${USER_ID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load todos.');
        }

        return response.json();
      })
      .then((data: Todo[]) => {
        setTodos(data);
      })
      .catch(() => {
        showNotification('Unable to load todos.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showNotification]);

  // Handle adding a new todo
  const handleAddTodo = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const trimmedTitle = newTodoTitle.trim();

      if (trimmedTitle === '') {
        showNotification('Title should not be empty.');

        return;
      }

      // Optimistic UI: Add temporary todo with id: 0
      const newTodo: Todo = {
        id: 0, // Temporary ID
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      setTempTodo(newTodo);
      setNewTodoTitle(''); // Clear input immediately for better UX
      // Clear previous errors (no setError used)
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: USER_ID,
            title: trimmedTitle,
            completed: false,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add a todo.');
        }

        const addedTodo: Todo = await response.json();

        setTodos(prevTodos => [...prevTodos, addedTodo]);
      } catch (err) {
        if (err instanceof Error) {
          showNotification(`Unable to add a todo: ${err.message}`);
        } else {
          showNotification('Unable to add a todo.');
        }

        setNewTodoTitle(trimmedTitle); // Keep text on error
      } finally {
        setTempTodo(null); // Hide temporary todo
        if (newTodoInputRef.current) {
          newTodoInputRef.current.focus(); // Focus input again
        }
      }
    },
    [newTodoTitle, showNotification],
  );

  // Handle deleting a todo
  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      setProcessingTodos(prev => new Set(prev.add(todoId))); // Add to processing set

      try {
        const response = await fetch(`${API_URL}/${todoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete todo.');
        }

        // On success, remove from list
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      } catch (err) {
        if (err instanceof Error) {
          showNotification(`Unable to delete a todo: ${err.message}`);
        } else {
          showNotification('Unable to delete a todo.');
        }
      } finally {
        setProcessingTodos(prev => {
          const newSet = new Set(prev);

          newSet.delete(todoId);

          return newSet;
        }); // Remove from processing set
      }
    },
    [showNotification],
  );

  // Handle clearing all completed todos
  const handleClearCompleted = useCallback(async () => {
    const completed = todos.filter(todo => todo.completed);

    if (completed.length === 0) {
      return;
    }

    const deletePromises = completed.map(async todo => {
      setProcessingTodos(prev => new Set(prev.add(todo.id)));
      try {
        const response = await fetch(`${API_URL}/${todo.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete todo: ${todo.title}`);
        }

        return { id: todo.id, success: true };
      } catch (err) {
        if (err instanceof Error) {
          showNotification(`Unable to delete "${todo.title}": ${err.message}`);
        } else {
          showNotification(`Unable to delete "${todo.title}".`);
        }

        return { id: todo.id, success: false };
      } finally {
        setProcessingTodos(prev => {
          const newSet = new Set(prev);

          newSet.delete(todo.id);

          return newSet;
        });
      }
    });

    const results = await Promise.all(deletePromises);
    const successfullyDeletedIds = results
      .filter(result => result.success)
      .map(result => result.id);

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );
  }, [todos, showNotification]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isProcessingAny =
    loading || tempTodo !== null || processingTodos.size > 0;

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>

        <TodoForm
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          onAddTodo={handleAddTodo}
          isDisabled={tempTodo !== null} // Disable input while tempTodo is present
          inputRef={newTodoInputRef}
        />
      </header>

      <section className="main">
        {loading && (
          <div className="loader-wrapper">
            <div className="loader" />
          </div>
        )}

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          processingTodos={processingTodos}
          onDeleteTodo={handleDeleteTodo}
        />
      </section>

      <Footer
        todos={todos}
        onClearCompleted={handleClearCompleted}
        isProcessingAny={isProcessingAny}
      />

      <Notification message={notification} />
    </section>
  );
};
