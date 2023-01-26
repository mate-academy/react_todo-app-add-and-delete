/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { filteredTodosFunction } from './components/Helpers/FilteredTodos';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Failed to load todos');
        });
    }
  }, []);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const filteredTodos = useMemo(() => (
    filteredTodosFunction(todos, status)
  ), [todos, status]);

  const createTodo = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        if (!title.trim()) {
          setErrorMessage('Title can\'t be empty');

          return;
        }

        setIsNewTodoLoading(true);

        if (user) {
          setTempTodo({
            id: 0,
            userId: user.id,
            title,
            completed: false,
          });

          const newTodo = await addTodo({
            userId: user.id,
            title,
            completed: false,
          });

          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
          setIsNewTodoLoading(false);
        }
      } catch (addTodoError) {
        setErrorMessage('Unable to add a todo');
      }
    }, [todos, user, title],
  );

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      ));

      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const clearTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos, removeTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          createTodo={createTodo}
          title={title}
          setTitle={setTitle}
          isNewTodoLoading={isNewTodoLoading}
        />
        <>
          <TodoList
            todos={filteredTodos}
            removeTodo={removeTodo}
            tempTodo={tempTodo}
            isNewTodoLoading={isNewTodoLoading}
          />
          <Footer
            activeTodos={activeTodos}
            status={status}
            setStatus={setStatus}
            clearTodos={clearTodos}
          />
        </>
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
