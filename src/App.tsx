/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
// eslint-disable-next-line import/extensions
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { TodoContext } from './contexts/TodoContext';

const USER_ID = 10305;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodos = useMemo(() => (
    todos.filter((todo) => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    switch (filter) {
      case Filter.Completed:
        return todo.completed;
      case Filter.Active:
        return !todo.completed;
      default:
        return todo;
    }
  }), [todos, filter]);

  const handleCreateTodo = () => {
    if (!title.trim()) {
      setError('Title cannot be empty');

      return;
    }

    setIsAdding(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then((addedTodod) => {
        setTodos([...todos, addedTodod]);
        setTitle('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
      });
  };

  const handleDeleteCompleted = () => {
    const completedIds = completedTodos.map((todo) => todo.id);

    completedIds.forEach((id) => {
      setIsDeleting(true);

      deleteTodo(id)
        .then(() => {
          setTodos(todos.filter((todo) => todo.id !== id));
        })
        .catch(() => setError('Unable to delete a todo'))
        .finally(() => setIsDeleting(false));
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => setTodos(response))
      .catch(() => setError('Unable to fetch todos'))
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleCreateTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              value={title}
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoContext.Provider value={{
          setTodos,
          isDeleting,
          isLoading,
          setIsDeleting,
          setError,
        }}
        >
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
          />
        </TodoContext.Provider>

        {todos.length > 0 && (
          <Footer
            activeTodosNumber={activeTodos.length}
            completedTodosNumber={completedTodos.length}
            filter={filter}
            setFilter={setFilter}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
