import React, {
  FormEvent,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotifaction } from
  './components/ErrorNotification/ErrorNotifaction';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorText } from './types/Error';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [errorText, setErrorText] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  useEffect(() => {
    const loadTodos = async (userId: number) => {
      try {
        const gotTodos = await getTodos(userId);

        setTodos(gotTodos);
      } catch (error) {
        setErrorText(`${error}`);
      }
    };

    if (!user) {
      return;
    }

    loadTodos(user.id);
  }, []);

  const getFilteredTodo = useMemo(() => todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [todos, filterType]);

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title || !user) {
      setErrorText(ErrorText.Title);

      return;
    }

    setIsAdding(true);
    try {
      const postTodo = await createTodo(title, user.id);

      setTodos((prevTodos) => [...prevTodos, postTodo]);
    } catch {
      setErrorText(ErrorText.Add);
    }

    setTitle('');

    setIsAdding(false);
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);
    try {
      await deleteTodo(TodoId);
      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== TodoId));
    } catch {
      setErrorText(ErrorText.Delete);
    }
  }, [todos, errorText]);

  const finishedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const deleteFinishedTodos = useCallback(() => {
    setSelectedId(finishedTodos.map(({ id }) => id));
    Promise.all(finishedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorText(ErrorText.Delete);
        setSelectedId([]);
      });
  }, [todos, selectedId, errorText]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={newTodo}
        />
        {
          todos.length > 0 && (
            <>
              <TodoList
                todos={getFilteredTodo}
                removeTodo={removeTodo}
                title={title}
                isAdding={isAdding}
                selectedId={selectedId}
              />
              <Footer
                filteredType={setFilterType}
                filterType={filterType}
                todos={todos}
                deleteCompleted={deleteFinishedTodos}
              />
            </>
          )
        }
      </div>
      {errorText && (
        <ErrorNotifaction
          errorText={errorText}
          seterrorText={setErrorText}
        />
      )}

    </div>
  );
};
