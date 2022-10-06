import React, {
  useEffect, useMemo, useContext, useState, useCallback, FormEvent,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [isSelectId, setIsSelectId] = useState<number[]>([]);

  useEffect(() => {
    const getTodoFromServer = async (userId: number) => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    };

    if (!user) {
      return;
    }

    getTodoFromServer(user.id);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterType) {
        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterType]);

  const isActiveTodos = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!user || !title) {
      setErrorMessage(ErrorMessage.ErrorTitle);

      return;
    }

    setIsLoading(true);

    try {
      const addedTodo = await addTodo(title, user.id);

      setTodos([...todos, addedTodo]);
    } catch {
      setErrorMessage(ErrorMessage.NotAdd);
    }

    setIsLoading(false);
    setTitle('');
  }, [user, title]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setIsSelectId([TodoId]);

    try {
      await deleteTodo(TodoId);
      setTodos([...todos.filter(({ id }) => id !== TodoId)]);
    } catch {
      setErrorMessage(ErrorMessage.NotDelete);
    }
  }, [todos, errorMessage]);

  const completedTodo = todos.filter(({ completed }) => !completed);

  const deleteTodoCompleted = useCallback(() => {
    setIsSelectId([...completedTodo].map(({ id }) => id));
    Promise.all(completedTodo.map(({ id }) => removeTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotDelete);
        setIsSelectId([]);
      });
  }, [todos, setIsSelectId, errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isActiveTodos={isActiveTodos}
          newTodo={newTodo}
          title={title}
          setTitle={setTitle}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              isLoading={isLoading}
              removeTodo={removeTodo}
              isSelectId={isSelectId}
            />
            <Footer
              filterType={filterType}
              handleFilter={setFilterType}
              todos={todos}
              deleteTodoCompleted={deleteTodoCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          handleError={setErrorMessage}
        />
      )}
    </div>
  );
};
