/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Error } from './types/Error';
import { Todo } from './types/Todo';
import { Submit } from './types/FormEvent';

const USER_ID = 6994;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.None);
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIDs, setDeletingTodoIDs] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data))
      .catch(() => setError(Error.Get));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setError(Error.None), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const isCompletedTodos = useMemo(
    () => todos.every(({ completed }) => completed),
    [todos],
  );

  const completedTodoIds = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    switch (status) {
      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [status, todos]);

  const handleRemoveTodo = useCallback((todoId: number) => {
    setDeletingTodoIDs(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos(
        (oldTodos => oldTodos.filter(todo => todo.id !== todoId)),
      ))
      .catch(() => setError(Error.Delete))
      .finally(() => setDeletingTodoIDs(
        prevIds => prevIds.filter(id => id !== todoId),
      ));
  }, []);

  const handleClearCompleted = useCallback(
    () => {
      setDeletingTodoIDs(completedTodoIds.map(todo => todo.id));

      completedTodoIds.forEach(todo => handleRemoveTodo(todo.id));
    },
    [todos],
  );

  const handleOnChange = useCallback(
    (value: string) => setQuery(value), [query],
  );

  const handleSubmit:Submit = useCallback((e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError(Error.Empty);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then((todo) => {
        setTodos((oldTodos) => [...oldTodos, todo]);
        setQuery('');
      })
      .catch(() => setError(Error.Add))
      .finally(() => setTempTodo(null));
  }, [query]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          hasTodos={!!todos.length}
          isDisabledField={!!tempTodo}
          isAcitveButton={isCompletedTodos}
          onSubmit={handleSubmit}
          onChange={handleOnChange}
        />

        <section className="todoapp__main">
          <TodoList
            tempTodo={tempTodo}
            todos={visibleTodos}
            deletingTodoIDs={deletingTodoIDs}
            handleRemoveTodo={handleRemoveTodo}
          />
        </section>

        {!!todos.length && (
          <Footer
            status={status}
            todos={todos}
            setStatus={setStatus}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Notification error={error} setError={setError} />
    </div>
  );
};
