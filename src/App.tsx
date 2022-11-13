import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/errorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { AppContext } from './components/AppContext';
import { ErrorTodo } from './types/ErrorTodo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const {
    showErrorMessage,
    closeErrorMessage,
    timerId,
    errorTodo,
    todosFromServer,
    setTodosFromServer,
  } = useContext(AppContext);

  const createTodo = async (title: string) => {
    setNewTodo({
      id: 0,
      title,
      completed: false,
      userId: user?.id,
    });
  };

  async function loadTodos() {
    closeErrorMessage();

    if (user) {
      const loadedTodos = await getTodos(user.id);

      try {
        if ('Error' in loadedTodos) {
          throw new Error();
        }

        if (loadedTodos.length) {
          setTodosFromServer(loadedTodos);
        }
      } catch {
        showErrorMessage(ErrorTodo.Download);
      }
    }
  }

  const numberOfNotCompletedTodo = useMemo(
    () => todosFromServer?.filter(todo => !todo.completed).length,
    [todosFromServer],
  );

  useEffect(() => {
    loadTodos();

    return () => {
      clearTimeout(timerId.current);
    };
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          numberOfCompletedTodo={numberOfNotCompletedTodo}
          onSetTempTodo={createTodo}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
        />

        <TodoList
          todos={todosFromServer}
          newTodo={newTodo}
        />

        {todosFromServer?.length && (
          <Footer numberOfNotCompletedTodo={numberOfNotCompletedTodo} />
        )}
      </div>

      <ErrorMessage
        typeError={errorTodo}
        onCloseErrorMessage={closeErrorMessage}
      />
    </div>
  );
};
