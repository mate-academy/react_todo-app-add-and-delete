import {
  useState,
  useContext,
  useEffect,
  useRef,
  FormEvent,
  useMemo,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { FilterStatus } from './types/FilterStatus';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosList } from './components/TodosList/TodosList';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const user = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoLoaded, setIsTodoLoaded] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterStatus.All:
          return todo;

        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterType]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const fetchData = async () => {
      const todosFromServer = await getTodos(user?.id || 0);

      setTodos(todosFromServer);
    };

    try {
      fetchData();
    } catch {
      setErrorMessage('Unable to connect to the server');
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Title can't be empty");

      return;
    }

    setIsTodoLoaded(true);

    try {
      const newTodo = await createTodo(user?.id || 0, title);

      setTodos([...todos, newTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTitle('');
      setIsTodoLoaded(false);
    }
  };

  const handleRemove = async (id: number) => {
    setSelectedTodos([...selectedTodos, id]);
    try {
      await deleteTodo(id);

      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    setSelectedTodos(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setSelectedTodos([]);
    }
  }, [completedTodos]);

  const handleTodoUpdate = async (todoId: number, data: Partial<Todo>) => {
    setSelectedTodos([...selectedTodos, todoId]);

    try {
      const newTodo = await updateTodo(todoId, data);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? newTodo
          : todo
      )));
    } catch {
      setErrorMessage('Unable to update a todo');
    }

    setSelectedTodos([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          newTodoField={newTodoField}
          todos={todos}
          onAddTodo={handleSubmit}
          isTodoLoaded={isTodoLoaded}
        />

        {(isTodoLoaded || todos.length > 0)
          && (
            <>
              <TodosList
                todos={filteredTodos}
                onRemoveTodo={handleRemove}
                isTodoLoaded={isTodoLoaded}
                title={title}
                selectedTodos={selectedTodos}
                setSelectedTodos={setSelectedTodos}
                onUpdate={handleTodoUpdate}
              />

              <Footer
                setFilterType={setFilterType}
                filterType={filterType}
                todos={todos}
                deleteCompletedTodos={deleteCompletedTodos}
              />
            </>
          )}
      </div>

      {errorMessage
        && (
          <ErrorNotification
            setError={setErrorMessage}
            error={errorMessage}
          />
        )}
    </div>
  );
};
