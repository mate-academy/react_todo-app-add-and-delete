/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  FormEvent,
} from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { FilterType } from './types/Filter';
import Header from './components/Header';
import TodoList from './components/TodoList';
import ErrorNotification from './components/ErrorNotification';
import Footer from './components/Footer';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (error) {
    setTimeout(() => {
      setError(null);
      setIsLoading(false);
    }, 3000);
  }

  let userId = 0;

  if (user?.id) {
    userId = user?.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Error.Connect));

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const handleAddTodo = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.Title);
      setTitle('');

      return;
    }

    setIsLoading(true);

    try {
      const todoToAdd = await createTodo(userId, title);

      setTodos(prev => [...prev, todoToAdd]);
    } catch {
      setError(Error.Add);
    } finally {
      setTitle('');
      setIsLoading(false);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(Error.Delete);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          newTodoField={newTodoField}
          addTodo={handleAddTodo}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            removeTodo={handleRemoveTodo}
          />
        )}

        <Footer
          todos={todos}
          filterType={filterType}
          setFilterType={setFilterType}
          removeTodo={handleRemoveTodo}
        />
      </div>

      <ErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
