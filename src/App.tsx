/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { FilterType } from './types/Filter';

const getFilterTodos = (
  todos: Todo[],
  filterType: FilterType,
) => {
  const copy = [...todos];

  switch (filterType) {
    case FilterType.Active:
      return copy.filter(({ completed }) => !completed);
    case FilterType.Completed:
      return copy.filter(({ completed }) => completed);
    default:
      return copy;
  }
};

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext<User | null>(AuthContext);
  const userId = user?.id ? user.id : 0;
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterBy, setFilterBy] = useState(FilterType.All);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const todoFromServer = async () => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(`${error}`);
      } finally {
        setIsLoaded(true);
      }
    };

    todoFromServer();
  }, []);

  const createTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title || !user) {
      setErrorMessage('Please add valid title');

      return;
    }

    try {
      const newTodo = await addTodo(user.id, title);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    }

    setTitle('');
  }, [user, title]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const filteredTodos = getFilterTodos(todos, filterBy);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          newTodoField={newTodoField}
          createTodo={createTodo}
          title={title}
          setTitle={setTitle}
        />
        {todos
          && (
            <>
              <Main
                todos={filteredTodos}
                isLoaded={isLoaded}
                removeTodo={removeTodo}
              />

              <Footer
                filteredTodos={filteredTodos}
                getFilteredBy={setFilterBy}
                selectedButtonType={filterBy}
                setTodos={setTodos}
                todos={todos}
                setErrorMessage={setErrorMessage}
                completedTodos={completedTodos}
              />
            </>
          )}

        {errorMessage
          && (
            <Error
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          )}
      </div>
    </div>
  );
};
