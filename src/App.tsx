import React, {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodoList } from './components/Todo/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Header } from './components/Header';
import { ErrorType } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [errorText, setErrorText] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const user = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const getTodosFromServer = async (userId: number) => {
        try {
          const receivedTodos = await getTodos(userId);

          setTodos(receivedTodos);
        } catch (error) {
          setErrorText(`${error}`);
        }
      };

      getTodosFromServer(user.id);
    }
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterBy]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorText(ErrorType.TITLE);
      setErrorStatus(true);

      return;
    }

    setIsAdding(true);

    try {
      const newTodo = await createTodo(user?.id || 0, title);

      setTodos([...todos, newTodo]);
      setIsAdding(false);
    } catch {
      setErrorText(ErrorType.ADD);
    }

    setTitle('');
    setSelectedId(user?.id || 0);
  };

  const deleteTodo = async (todoId: number) => {
    setSelectedId(todoId);

    try {
      await removeTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorText(ErrorType.DELETE);
    }
  };

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const deleteCompletedTodos = async () => {
    try {
      Promise.all(completedTodos
        .map(({ id }) => removeTodo(id)));

      setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed));
    } catch {
      setErrorText(ErrorType.DELETE);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              isAdding={isAdding}
              selectedId={selectedId}
            />
            <Footer
              todos={filteredTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorStatus={errorStatus}
        setErrorStatus={setErrorStatus}
        errorText={errorText}
      />
    </div>
  );
};
