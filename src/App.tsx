import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/NewTodo';
import { Footer } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [
    filterStatus,
    setFilterStatus,
  ] = useState<FilterStatus>(FilterStatus.All);
  const [error, setError] = useState<string | null>('');
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const loadTodos = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch {
        setError('Unable to load a todo');
      }
    };

    if (user) {
      loadTodos(user.id);
    }
  }, [user]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterStatus) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setError('Title can\'t be empty');
      setTitle('');

      return;
    }

    if (!user) {
      return;
    }

    const addNewTodo = {
      id: 0,
      userId: user.id,
      title,
      completed: false,
    };

    setIsAdd(true);

    setTodos([...todos, addNewTodo]);

    try {
      const newTodo = await addTodo(user.id, title);

      setTodos([...todos, newTodo]);
    } catch {
      setError('Unable to add a todo');
      setTodos(filteredTodos.filter(todo => todo.id > 0));
    }

    setIsAdd(false);
    setTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDelete = async (todoId: number) => {
    setSelectedTodo(prevId => [...prevId, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setSelectedTodo(prevId => prevId.filter(id => id !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          newTodoField={newTodoField}
          title={title}
          handleChange={handleChange}
          isAdd={isAdd}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              selectedTodo={selectedTodo}
              handleDelete={handleDelete}
            />

            <Footer
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filteredTodos={filteredTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
