/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { Errors } from './components/Errors';
import { ErrorType } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  const getTodosFromServer = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(user?.id || 1);

      setTodos(todosFromServer);
    } catch (err) {
      setErrorMessage('Failed to loaded todos');
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage(ErrorType.None);

      if (title.trim() && user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await getTodosFromServer();
          setTitle('');
        } catch {
          setErrorMessage(ErrorType.Add);
        } finally {
          setIsAdding(false);
        }
      } else {
        setErrorMessage(ErrorType.EmptyTitle);
      }
    }, [title, user],
  );

  const handleDelete = useCallback(
    async (todoId: number) => {
      setErrorMessage(ErrorType.None);
      setLoadingTodosIds(prevIds => [...prevIds, todoId]);
      try {
        await deleteTodo(todoId);

        await getTodosFromServer();
      } catch {
        setErrorMessage(ErrorType.Delete);
      } finally {
        setLoadingTodosIds([]);
      }
    }, [],
  );

  const handleClearCompleted = useCallback(async () => {
    try {
      setLoadingTodosIds(prevIds => (
        [...prevIds,
          ...completedTodos.map(todo => todo.id),
        ]
      ));

      await Promise.all(completedTodos.map(async (todo) => {
        await deleteTodo(todo.id);
      }));

      await getTodosFromServer();

      setLoadingTodosIds([]);
    } catch (error) {
      setErrorMessage(ErrorType.Delete);
    }
  }, [completedTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          isAdding={isAdding}
        />

        <TodoList
          todos={todos}
          status={status}
          onDelete={handleDelete}
          isAdding={isAdding}
          loadingTodosIds={loadingTodosIds}
          currentTitle={title}
        />
        <Footer
          status={status}
          activeTodos={activeTodos}
          setStatus={setStatus}
          onClear={handleClearCompleted}
        />
      </div>

      <Errors currError={errorMessage} setCurrError={setErrorMessage} />
    </div>
  );
};
