/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/Auth/ErrorNotification/index';
import { Footer } from './components/Auth/Footer/index';
import { TodoList } from './components/Auth/TodoList/index';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { Error } from './types/Errors';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAdding, setIsAdding] = useState(false);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.All:
        return todo;

      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return null;
    }
  });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  if (error) {
    setTimeout(() => {
      setError(null);
      setIsAdding(false);
    }, 3000);
  }

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Error.LOADING));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.ADDING);

      return;
    }

    setIsAdding(true);

    await createTodo(userId, title)
      .then(todo => {
        setTodos([...todos, todo]);
      })
      .catch(() => {
        setError(Error.ADDING);
      });

    setIsAdding(false);
    setTitle('');
  };

  const deleteTodo = (todoId: number) => {
    setSelectedTodos([todoId]);
    removeTodo(todoId)
      .then(() => {
        setTodos([...todos.filter(todo => todo.id !== todoId)]);
      })
      .catch(() => {
        setError(Error.DELETING);
        setSelectedTodos([]);
      });
  };

  const completeTodos = todos.filter(todo => todo.completed);

  const clearCompleted = () => {
    setSelectedTodos([...completeTodos].map(todo => todo.id));

    Promise.all(completeTodos.map(todo => removeTodo(todo.id)))
      .then(() => {
        setTodos([...todos.filter(todo => !todo.completed)]);
      })
      .catch(() => {
        setError(Error.DELETING);
        setSelectedTodos([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />
          )}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              disabled={isAdding}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              title={title}
              onDelete={deleteTodo}
              selectTodo={setSelectedTodos}
              isAdding={isAdding}
              selectedTodo={selectedTodos}
            />
            <Footer
              todos={todos}
              onFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              onClear={clearCompleted}
              completeTodos={completeTodos}
            />
          </>
        )}
      </div>
      {(error) && (
        <ErrorNotification
          errors={error}
          onErrorChange={setError}
        />
      )}
    </div>
  );
};
