/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from
  './components/Auth/ErrorNotification/ErrorNotification';
import { Footer } from './components/Auth/Footer/Footer';
import { Header } from './components/Auth/Header/Header';
import { TodoList } from './components/Auth/TodoList/TodoList';
import { ErrorMessage } from './types/Error';
import { FilterType } from './types/FilterBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const user = useContext(AuthContext);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const getTodosFromServer = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    };

    if (!user) {
      return;
    }

    getTodosFromServer(user.id);
  }, []);

  const getFilteredTodo = todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title || !user) {
      setErrorMessage(ErrorMessage.ErrorTitle);

      return;
    }

    setIsAdding(true);

    try {
      const postTodo = await createTodo(title, user.id);

      setTodos([...todos, postTodo]);
    } catch {
      setErrorMessage(ErrorMessage.NotAdd);
    }

    setTitle('');
    setIsAdding(false);
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);
    try {
      await deleteTodo(TodoId);

      setTodos([...todos.filter(({ id }) => id !== TodoId)]);
    } catch {
      setErrorMessage(ErrorMessage.NotDelete);
    }
  }, [todos, errorMessage]);

  const completedTodos = todos.filter(({ completed }) => completed);

  const deleteCompletedTodos = useCallback(() => {
    setSelectedId([...completedTodos].map(({ id }) => id));

    Promise.all(completedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotDelete);
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodosField={newTodoField}
          setTitle={setTitle}
          title={title}
          handleSubmit={newTodo}
        />
        {
          (isAdding || todos.length > 0) && (
            <>
              <TodoList
                todos={getFilteredTodo}
                removeTodo={removeTodo}
                selectedId={selectedId}
                isAdding={isAdding}

              />
              <Footer
                filterTypes={setFilterType}
                filterType={filterType}
                todos={todos}
                deleteCompleted={deleteCompletedTodos}
              />
            </>
          )
        }

      </div>
      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}

    </div>
  );
};
