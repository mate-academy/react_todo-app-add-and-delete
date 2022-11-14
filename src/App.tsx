import React, {
  useState,
  useMemo,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { addNewTodo, deleteTodo, getTodos } from './api/todos';
import { FilterType } from './types/FilterType';
import { Error } from './types/Error';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import
{ ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIDs, setDeletedTodoIDs] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>({
    hasMessage: '',
  });

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromServer = async (userId: number) => {
    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage({
        hasMessage: 'Can\'t fetch data from server',
      });
    }
  };

  const addTodoToServer = async (title: string) => {
    try {
      if (user) {
        setIsAdding(true);

        await addNewTodo(title, user.id);

        await getTodosFromServer(user.id);

        setIsAdding(false);
      }
    } catch (error) {
      setErrorMessage({
        hasMessage: 'Unable to add a todo',
      });
      setIsAdding(false);
    }
  };

  const deleteTodoAtServer = async (id: number) => {
    try {
      setDeletedTodoIDs(prevIDs => [...prevIDs, id]);
      await deleteTodo(id);
      if (user) {
        await getTodosFromServer(user.id);
      }
    } catch (error) {
      setErrorMessage({
        hasMessage: 'Unable to delete a todo',
      });
    }
  };

  const filteredTodos = useMemo(
    () => (
      todos.filter((todo) => {
        switch (filterBy) {
          case FilterType.Active:
            return !todo.completed;
          case FilterType.Completed:
            return todo.completed;
          default:
            return todos;
        }
      })),
    [todos, filterBy],
  );

  const activeTodosCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const deleteCompletedTodos = async () => {
    try {
      setDeletedTodoIDs(() => completedTodos.map(todo => todo.id));
      await Promise.all(completedTodos.map(async (todo) => (
        deleteTodo(todo.id)
      )));

      if (user) {
        await getTodosFromServer(user.id);
      }
    } catch (error) {
      setErrorMessage({
        hasMessage: 'Unable to delete completed todos',
      });
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodosFromServer(user.id);
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage({
        hasMessage: '',
      });
    }, 3000);
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoField={newTodoField}
          addTodoToServer={addTodoToServer}
          isAdding={isAdding}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          filteredTodos={filteredTodos}
          isAdding={isAdding}
          deleteTodoAtServer={deleteTodoAtServer}
          deletedTodoIDs={deletedTodoIDs}
        />

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteCompletedTodos={deleteCompletedTodos}
            completedTodos={completedTodos}
          />
        )}
      </div>

      {errorMessage.hasMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
