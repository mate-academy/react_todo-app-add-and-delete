import React, {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { FilterBy } from './types/FilterBy';
import { Errors } from './types/Errors';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<Errors | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [loader, setLoader] = useState(false);
  const [newTodoId, setNewTodoId] = useState(0);

  const filterTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.All:
        return todo;
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const userId = user?.id || 0;

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Errors.Loading));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.Title);
      setTitle('');

      return;
    }

    setLoader(true);
    setTodos([...todos, {
      title,
      userId,
      completed: false,
      id: 0,
    }]);

    await createTodo(userId, title)
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setLoader(false);
      })
      .catch(() => {
        setError(Errors.Add);
      });

    setTitle('');
  };

  const removeTodo = async (todoId: number) => {
    setLoader(true);
    setNewTodoId(todoId);
    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(Errors.Delete);
      })
      .finally(() => setLoader(false));
  };

  const todosCompleted = useMemo(
    () => filterTodos.filter(({ completed }) => completed),
    [todos],
  );
  const todosActive = useMemo(
    () => filterTodos.filter(({ completed }) => !completed),
    [todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filterTodos}
          todosCompleted={todosCompleted}
          handleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={filterTodos}
          removeTodo={removeTodo}
          loader={loader}
          newTodoId={newTodoId}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            removeTodo={removeTodo}
            todosActive={todosActive}
            todosCompleted={todosCompleted}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
