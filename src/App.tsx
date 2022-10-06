import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodosList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { deleteTodos, getTodos, createTodos } from './api/todos';
import { Error } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorNotification, setErrorNotification] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [todosAdded, setTodosAdded] = useState(false);
  const [selectedTodosIds, setSelectedTodosIds] = useState<number[]>([]);
  const user = useContext(AuthContext);

  const filteredTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.All:
          return todos;

        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        default:
          return true;
      }
    });
  }, [filterType, todos]);

  useEffect(() => {
    const getTodosFromServer = async (userId: number) => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch {
        setErrorNotification(Error.Load);
      }
    };

    if (user) {
      getTodosFromServer(user.id);
    }
  }, []);

  const addTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !user) {
      setErrorNotification(Error.Title);

      return;
    }

    setTodosAdded(true);

    try {
      const postTodo = await createTodos(title, user.id);

      setTodos((prevTodos) => [...prevTodos, postTodo]);
    } catch {
      setErrorNotification(Error.Add);
    }

    setTodosAdded(false);
    setTitle('');
  }, [title, user]);

  const removeTodo = useCallback(async (todoId: number) => {
    setSelectedTodosIds([todoId]);
    try {
      await deleteTodos(todoId);

      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== todoId));
    } catch {
      setErrorNotification(Error.Delete);
    }
  }, [todos, errorNotification]);

  const completedTodosIds = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const deleteCompletedTodo = useCallback(() => {
    setSelectedTodosIds(completedTodosIds.map(({ id }) => id));

    Promise.all(completedTodosIds.map(({ id }) => removeTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorNotification(Error.Delete);
        setSelectedTodosIds([]);
      });
  }, [todos, selectedTodosIds, errorNotification]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={addTodo}
        />
        {!!todos.length && (
          <TodosList
            todos={filteredTodos}
            selectedTodosIds={selectedTodosIds}
            newTitle={title}
            isAdding={todosAdded}
            onDelete={removeTodo}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            onDelete={deleteCompletedTodo}
          />
        )}
      </div>

      {errorNotification && (
        <ErrorNotification
          errorNotification={errorNotification}
          setErrorNotification={setErrorNotification}
        />
      )}
    </div>
  );
};
