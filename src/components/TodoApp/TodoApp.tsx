import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from '../../types/User';
import { AuthContext } from '../Auth/AuthContext';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/filterType';
import { Errors } from '../../types/Errors';
import { getTodos } from '../../api/todos';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp: FunctionComponent = () => {
  const user = useContext<User | null>(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.None);
  const [title, setTitle] = useState<string>('');
  const [selectedTodosId, setSelectedTodosId] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const loadingTodosFromServer = useCallback(async () => {
    if (user) {
      try {
        const addTodos = await getTodos(user.id);

        setTodos(addTodos);
      } catch {
        setErrorMessage(Errors.Loading);
      }
    }
  }, [user]);

  useEffect(() => {
    loadingTodosFromServer().then();
  }, []);

  return (
    <>
      <Header
        todos={todos}
        title={title}
        setTitle={setTitle}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        setErrorMessage={setErrorMessage}
        loadingTodosFromServer={loadingTodosFromServer}
      />

      {!!todos.length && (
        <>
          <TodoList
            todos={todos}
            title={title}
            filterBy={filterBy}
            selectedTodosId={selectedTodosId}
            isAdding={isAdding}
            setErrorMessage={setErrorMessage}
            setSelectedTodosId={setSelectedTodosId}
            loadingTodosFromServer={loadingTodosFromServer}
          />

          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            setErrorMessage={setErrorMessage}
            setSelectedTodosId={setSelectedTodosId}
          />
        </>
      )}

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  );
};
