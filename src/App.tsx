import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import './styles/index.scss';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo, createTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { filterTodos, getItemsLeft } from './helpers';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Progress } from './types/Progress';
import { ErrorType } from './types/ErrorEnum';
import { ErrorBlock } from './components/Error/ErrorBlock';

const USER_ID = 12022;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [progressStatus, setProgressStatus] = useState<Progress>(Progress.All);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => setErrorMessage(ErrorType.Loading));
  }, []);

  const itemsLeftToShow = getItemsLeft(todosFromServer);

  const isAllTodosCompeted = todosFromServer.every(todo => todo.completed);

  const todosToRender = useMemo(
    () => filterTodos(todosFromServer, progressStatus),
    [todosFromServer, progressStatus],
  );

  const closeError = useCallback(() => setErrorMessage(null), []);

  const removeTodo = useCallback(
    async (todoId: number) => {
      try {
        await deleteTodo(todoId);

        setTodosFromServer(
          currentTodos => currentTodos.filter(todo => todo.id !== todoId),
        );
      } catch (error) {
        setErrorMessage(ErrorType.Delete);
      }
    },
    [],
  );

  const isAnyCompleted = todosFromServer.some(todo => todo.completed);

  const addTodo = useCallback(
    async (title: string, userId: number) => {
      try {
        setTempTodo({
          id: 0,
          title,
          completed: false,
          userId,
        });

        const newTodo = await createTodo(title, userId);

        setTodosFromServer((currentTodos) => [
          ...currentTodos,
          newTodo,
        ]);

        setTempTodo(null);
      } catch (error) {
        setErrorMessage(ErrorType.Todo);
      }
    },
    [],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllTodosCompeted}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={todosToRender}
          onDelete={removeTodo}
          addTodo={addTodo}
          tempTodo={tempTodo}
        />

        {todosFromServer.length > 0 && (
          <Footer
            itemsLeft={itemsLeftToShow}
            setProgress={setProgressStatus}
            isAnyCompleted={isAnyCompleted}
            todos={todosFromServer}
            onClear={removeTodo}
          />
        )}

        {errorMessage && (
          <ErrorBlock
            onClose={closeError}
            errMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
};
