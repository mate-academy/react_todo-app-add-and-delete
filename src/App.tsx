import React, {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [errorText, setErrorText] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

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
    } catch {
      setErrorText(ErrorType.ADD);
    }

    setIsAdding(false);
    setTitle('');
    setSelectedId(user?.id || 0);
  };

  const deleteTodo = (todoId: number) => {
    setSelectedId(todoId);

    const newData = async () => {
      try {
        await removeTodo(todoId);

        setTodos(todos.filter(todo => todo.id !== todoId));
      } catch {
        setErrorText(ErrorType.DELETE);
      }
    };

    newData();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
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
            />
            <Footer
              todos={filteredTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
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
