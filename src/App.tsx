import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import { getTodos, createTodos, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { FilterBy } from './types/filterBy';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState('all');
  const [title, setTitle] = useState('');
  const [isAdding, setAdding] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    async function todosFromServer(userId: number | undefined) {
      try {
        const visibleTodos = getTodos(userId);

        setTodos(await visibleTodos);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    }

    if (!user) {
      return;
    }

    todosFromServer(user.id);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.All:
          return todo;

        case FilterBy.Active:
          return !todo.completed;

        case FilterBy.Completed:
          return todo.completed;

        default:
          return null;
      }
    });
  }, [todos, filterBy]);

  const handleTodos = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can`t be empty');

      return;
    }

    setAdding(true);

    try {
      const newTodo = await createTodos(user?.id, title);

      setTodos([...todos, newTodo]);
    } catch {
      setErrorMessage('Can\'t be added');
    }

    setTitle('');
    setAdding(false);
  };

  const removeTodo = async (todoId: number) => {
    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });

    setAdding(true);

    setTimeout(() => setAdding(false), 300);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        newTodoField={newTodoField}
        title={title}
        setTitle={setTitle}
        handleTodos={handleTodos}
      />
      {todos.length > 0 && (
        <div className="todoapp__content">
          <TodoList
            isAdding={isAdding}
            todos={filteredTodos}
            title={title}
            removeTodo={removeTodo}
          />
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            filteredTodos={filteredTodos}
          />
        </div>
      )}
      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
