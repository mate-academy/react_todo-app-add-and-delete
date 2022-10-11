import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErroNotification } from './components/Auth/ErrorNotificattion';
import { Filter } from './components/Auth/Filters';
import { Todos } from './components/Auth/Todo';
import { TodoList } from './components/Auth/TodoList';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { Errors } from './types/error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFiterBy] = useState(Filters.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    async function todosFromServer() {
      try {
        if (user) {
          const visibleTodos = getTodos(user.id);

          setTodos(await visibleTodos);
        }
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    }

    todosFromServer();
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      return setErrorMessage(Errors.title);
    }

    if (user) {
      await createTodo(user.id, title)
        .then(async newTodo => {
          setTodos((prevTodos) => [...prevTodos, newTodo]);
        })
        .catch(() => {
          setErrorMessage(Errors.create);
        });
    }

    setIsAdding(false);

    return setTitle('');
  }, [todos, title, isAdding]);

  const handleremoveTodo = useCallback(
    async (todoId: number) => {
      setSelectedId([todoId]);
      setIsAdding(true);
      await deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          setErrorMessage(Errors.delete);
        });
    }, [selectedId, isAdding, todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const handleDeleteCompletedTodos = useCallback(() => {
    setSelectedId(completedTodos.map(({ id }) => id));

    Promise.any(completedTodos.map(({ id }) => handleremoveTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage(Errors.delete);
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  const filterTodoBy = useMemo(() => todos.filter(todo => {
    switch (filterBy) {
      case Filters.Active:
        return !todo.completed;

      case Filters.Completed:
        return todo.completed;
      default:
        return todo;
    }
  }), [todos]);

  const isCompletedTodos = todos.some(({ completed }) => completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Todos
        newTodoField={newTodoField}
        handleSubmit={handleSubmit}
        setTitle={setTitle}
        title={title}
      />

      {todos.length > 0 && (
        <div className="todoapp__content">
          <TodoList
            todos={filterTodoBy}
            handleremoveTodo={handleremoveTodo}
            isAdding={isAdding}
            selectedId={selectedId}
          />

          <Filter
            setFilterBy={setFiterBy}
            todos={filterTodoBy}
            filterBy={filterBy}
            deleteTodo={handleDeleteCompletedTodos}
            isCompletedTodos={isCompletedTodos}
          />
        </div>
      )}

      {errorMessage && (
        <ErroNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}

        />
      )}
    </div>
  );
};
