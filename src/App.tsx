/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { NewTodo } from './components/NewTodo';
import { getTodos } from './api/todos';
import { Todo, SortType } from './types/Todo';
import { Status } from './types/Status';

export const statuses:Status[] = [
  { id: '1', title: SortType.ALL, link: '/' },
  { id: '2', title: SortType.ACTIVE, link: '/active' },
  { id: '3', title: SortType.COMPLETED, link: '/completed' },
];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoId, setTodoId] = useState(0);
  const [selectedStatusId, setSelectedStatusId] = useState(statuses[0].id);
  const [hasLoadingErrod, setHasLoadingError] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const selectedStatus = statuses
    .find(status => selectedStatusId === status.id) || statuses[0];

  const onStatusSelected = (status:Status) => {
    setSelectedStatusId(status.id);
  };

  const loadTodos = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user?.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasLoadingError(true);
      setErrorNotification('Unable to update a todo');
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();

    const timer = setTimeout(() => {
      setHasLoadingError(false);
    }, 3000);

    return () => clearTimeout(timer);

    // focus the element with `ref={newTodoField}`
  }, []);

  const filteredTodos = todos
    .filter(({ completed }) => {
      switch (selectedStatus.title) {
        case SortType.ACTIVE:
          return !completed;

        case SortType.COMPLETED:
          return completed;

        default:
          return true;
      }
    });

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

          <NewTodo
            newTodoField={newTodoField}
            todos={todos}
            user={user}
            setTodos={setTodos}
            setHasLoadingError={setHasLoadingError}
            setErrorNotification={setErrorNotification}
            setIsLoading={setIsLoading}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          setTodoId={setTodoId}
          setTodos={setTodos}
          setHasLoadingError={setHasLoadingError}
          setErrorNotification={setErrorNotification}
          todoId={todoId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <Footer
          statuses={statuses}
          selectedStatusId={selectedStatusId}
          onStatusSelected={onStatusSelected}
          todos={todos}
          setTodoId={setTodoId}
          setTodos={setTodos}
          setHasLoadingError={setHasLoadingError}
          setErrorNotification={setErrorNotification}
        />
      </div>

      {
        hasLoadingErrod && (
          <ErrorNotification
            errorNotification={errorNotification}
          />
        )
      }
    </div>
  );
};
