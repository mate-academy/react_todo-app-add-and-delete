import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Filter } from './components/Filter';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import {
  getTodos,
  createTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
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
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [todoStatus, setStatus] = useState(false);

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

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);
    try {
      await deleteTodo(TodoId);

      setTodos([...todos.filter(({ id }) => id !== TodoId)]);
    } catch {
      setErrorMessage('Error');
    }
  }, [todos, errorMessage]);

  const completedTodos = todos.filter(({ completed }) => completed);

  const deleteCompletedTodos = useCallback(() => {
    setSelectedId([...completedTodos].map(({ id }) => id));

    Promise.all(completedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage('Error');
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  const handleChange = useCallback(async (updateId: Todo) => {
    setStatus((current: boolean) => current);

    try {
      await updateTodo(updateId.id, todoStatus);

      setTodos(state => [...state].map(todo => {
        if (todo.id === updateId.id) {
          // eslint-disable-next-line no-param-reassign
          todo.completed = !todo.completed;
        }

        return todo;
      }));
    } catch {
      setErrorMessage('Not update');
    }
  }, [todoStatus, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <NewTodo
        todos={todos}
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
            selectedId={selectedId}
            removeTodo={removeTodo}
            handleChange={handleChange}
          />
          <Filter
            deleteCompletedTodos={deleteCompletedTodos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            todos={todos}
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
