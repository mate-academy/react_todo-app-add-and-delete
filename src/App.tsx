/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { FilterStatus } from './types/FilterStatus';
import { Footer } from './components/TodoFilter/TodoFilter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState<string | null>('');
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [isAdd, setIsAdd] = useState(false);

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 1000);
  }

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

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      case FilterStatus.All:
        return todo;
      default:
        return 0;
    }
  });

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
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChange}
              disabled={isAdd}
            />
          </form>
        </header>

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
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
