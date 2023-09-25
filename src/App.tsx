/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SearchField } from './components/SearchField';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';
import { ErrorProvider } from './context/TodoError';
import { ErrorBox } from './components/ErrorBox';
import { waitToClose } from './utils/hideErrorWithDelay';
import { USER_ID } from './utils/constants';
import { TodoStatus } from './types/TodoStatus';
import { LoaddingProvider } from './context/Loading';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(TodoStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const { setError } = useContext(ErrorProvider);
  const { setIsLoading } = useContext(LoaddingProvider);

  const hasAddTodoErrorTimerId = useRef(-1);
  const hasGetTodoErrorTimerId = useRef(-1);
  const hasDeleteTodoErrorTimerId = useRef(-1);

  const inputFieldRef = useRef<HTMLInputElement | null>(null);

  const hasTodos = todos.length > 0;

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)

      .then((data) => {
        setIsLoading(false);
        setTodos(data);

        setError(prev => ({
          ...prev,
          hasError: false,
        }));
      })

      .catch(() => {
        setIsLoading(false);

        setError(prev => ({
          ...prev,
          message: 'Unable to load todos',
          hasError: true,
        }));
      });

    hasGetTodoErrorTimerId.current = waitToClose(3000, setError);
  }, []);

  const filteredTodo = useMemo(() => todos.filter(todo => {
    switch (selectedStatus) {
      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [selectedStatus, todos]);

  const countOfNotCompletedTodo = useMemo(() => todos
    .filter((todo) => !todo.completed).length, [todos]);

  const allTodoCompleted = useMemo(() => filteredTodo
    .every(({ completed }) => completed), [filteredTodo]);

  const atleastOneTodoCompleted = useMemo(() => filteredTodo
    .some(({ completed }) => completed), [filteredTodo]);

  const handleDeleteCompleted = async () => {
    setIsLoading(true);

    const requests = todos
      .filter((todo) => todo.completed)
      .map(async (todo) => {
        setDeletedTodoIds(prevTodos => [...prevTodos, todo.id]);

        await deleteTodo(todo.id);
        setTodos(prev => prev.filter(({ id }) => todo.id !== id));
      });

    try {
      await Promise.all(requests);

      setIsLoading(false);

      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (error) {
      setIsLoading(false);

      setError(prev => ({
        ...prev,
        message: 'Unable to delete a todo',
        hasError: true,
      }));

      setDeletedTodoIds(() => []);
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <SearchField
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          allTodoCompleted={allTodoCompleted}
          inputFieldRef={inputFieldRef}
          hasTodos={hasTodos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          hasAddTodoErrorTimerId={hasAddTodoErrorTimerId}
        />

        {Boolean(todos.length) && (
          <TodoList
            setTodos={setTodos}
            todos={filteredTodo}
            tempTodo={tempTodo}
            inputFieldRef={inputFieldRef}
            hasDeleteTodoErrorTimerId={hasDeleteTodoErrorTimerId}
            setDeletedTodoIds={setDeletedTodoIds}
            deletedTodoIds={deletedTodoIds}
          />
        )}

        {Boolean(todos.length) && (
          <Footer
            countOfNotCompletedTodo={countOfNotCompletedTodo}
            setSelectedStatus={setSelectedStatus}
            atleastOneTodoCompleted={atleastOneTodoCompleted}
            selectedStatus={selectedStatus}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorBox
        hasAddTodoErrorTimerId={hasAddTodoErrorTimerId}
        hasGetTodoErrorTimerId={hasGetTodoErrorTimerId}
        hasDeleteTodoErrorTimerId={hasDeleteTodoErrorTimerId}
        inputFieldRef={inputFieldRef}
      />
    </div>
  );
};
