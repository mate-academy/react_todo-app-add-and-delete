/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  FormEvent,
  useCallback,
} from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { FilterType } from './types/Filter';
import TodoPanel from './components/TodoPanel';
import TodoList from './components/TodoList';
import ErrorNotification from './components/ErrorNotification';
import Filter from './components/Filter';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const handleAddTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.Title);
      setTitle('');

      return;
    }

    setIsLoading(true);

    try {
      const todoToAdd = await createTodo(userId, title);

      setSelectedId(todoToAdd.id);

      setTodos(prevState => [...prevState, todoToAdd]);
    } catch {
      setError(Error.Add);
    } finally {
      setTitle('');
      setIsLoading(false);
    }
  }, [title]);

  const handleRemoveTodo = async (todoId: number) => {
    setIsLoading(true);
    setSelectedId(todoId);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(Error.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoPanel
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
            isLoading={isLoading}
            selectedId={selectedId}
          />
        )}

        <Filter
          todos={todos}
          filterType={filterType}
          setFilterType={setFilterType}
          removeTodo={handleRemoveTodo}
        />
      </div>

      <ErrorNotification
        errorDetected={error}
        setError={setError}
      />
    </div>
  );
};
