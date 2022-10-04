import {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
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
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [isShownTempTodo, setIsShownTempTodo] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const selectedStatus = statuses
    .find(status => selectedStatusId === status.id) || statuses[0];

  const onStatusSelected = (status:Status) => {
    setSelectedStatusId(status.id);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        if (user) {
          const todosFromServer = await getTodos(user?.id);

          setIsShownTempTodo(false);

          setTodos(todosFromServer);
        }
      } catch (error) {
        setErrorNotification('Unable to update a todo');
      }
    };

    loadTodos();
  }, []);

  const filteredTodos:Todo[] = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (selectedStatus.title) {
        case SortType.ACTIVE:
          return !completed;

        case SortType.COMPLETED:
          return completed;

        default:
          return true;
      }
    });
  }, [todos, selectedStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="toggle"
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <NewTodo
            newTodoField={newTodoField}
            todos={todos}
            user={user}
            setTodos={setTodos}
            setErrorNotification={setErrorNotification}
            setIsShownTempTodo={setIsShownTempTodo}
            setPreviewTitle={setPreviewTitle}
          />
        </header>
        {todos.length > 0
          && (
            <>
              <TodoList
                todos={filteredTodos}
                setTodoId={setTodoId}
                setTodos={setTodos}
                setErrorNotification={setErrorNotification}
                todoId={todoId}
                isShownTempTodo={isShownTempTodo}
                previewTitle={previewTitle}

              />

              <Footer
                statuses={statuses}
                selectedStatusId={selectedStatusId}
                onStatusSelected={onStatusSelected}
                todos={todos}
                setTodoId={setTodoId}
                setTodos={setTodos}
                setErrorNotification={setErrorNotification}
              />
            </>
          )}
      </div>

      <ErrorNotification
        errorNotification={errorNotification}
        setErrorNotification={setErrorNotification}
        isErrorShown={isErrorShown}
        setIsErrorShown={setIsErrorShown}
      />
    </div>
  );
};
