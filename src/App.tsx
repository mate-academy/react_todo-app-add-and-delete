import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo, deleteTodo, getTodos, TodoData,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTodosQuantity, setActiveTodosQuantity] = useState(0);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getTodosFromServer = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);
        const activeTodosNumber = todosFromServer
          .filter(({ completed }) => !completed).length;

        setTodos(todosFromServer);
        setActiveTodosQuantity(activeTodosNumber);
      } catch {
        setIsError(true);
      }
    }
  }, []);

  const handleAddTodoToServer = useCallback(async (title: string) => {
    if (!title) {
      setIsError(true);
      setErrorMessage('Title can\'t be empty');
    } else {
      setIsAdding(true);
      const temporaryTodo = {
        id: 0,
        userId: user?.id,
        title,
        completed: false,
      };

      setVisibleTodos((currentTodos) => [...currentTodos, temporaryTodo]);
      const newTodo: TodoData = {
        userId: user?.id,
        title,
        completed: false,
      };

      try {
        await createTodo(newTodo);
      } catch (error) {
        setIsError(true);
        setErrorMessage('Unable to add a todo');
      }

      await getTodosFromServer();
      setIsAdding(false);
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (id: number) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      setIsError(true);
      setErrorMessage('Unable to delete a todo');
    }

    await getTodosFromServer();
  }, []);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    setIsDeleting(true);
    try {
      await Promise.all(completedTodos.map(async ({ id }) => (
        deleteTodoFromServer(id)
      )));
    } catch (error) {
      setIsError(true);
      setErrorMessage('Unable to delete completed todos');
    }

    setIsDeleting(false);
  }, [completedTodos]);

  useEffect(() => {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }, [isError]);

  useEffect(() => {
    setVisibleTodos(todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.ACTIVE:
          return !todo.completed;

        case FilterBy.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    }));
  }, [todos, filterBy]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={handleAddTodoToServer}
          isAdding={isAdding}
          activeTodosQuantity={activeTodosQuantity}
        />

        <TodoList
          visibleTodos={visibleTodos}
          deleteTodo={deleteTodoFromServer}
          completedTodos={completedTodos}
          isDeleting={isDeleting}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosQuantity={activeTodosQuantity}
            completedTodosQuantity={completedTodos.length}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {isError && (
        <ErrorNotification
          isError={isError}
          setIsError={setIsError}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
