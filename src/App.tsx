/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todoApi from './api/todos';
import { TodoForm } from './Components/TodoForm';
import { TodoList } from './Components/TodoList';
import { TodoFooter } from './Components/TodoFooter';
import { Todo } from './types/Todo';
import { FilterTodo } from './types/FilterTodo';
import { filterTodo } from './Services/Todo';
import { ErrorNotification } from './Components/ErrorNotification';
import { AppError } from './types/Errors';
import { TodoContext } from './Contexts/TodoContext';
export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<AppError | null>(null);
  const [filter, setFilter] = useState<FilterTodo>(FilterTodo.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerCloseId = useRef(0);

  const addErrorMessage = (message: string, isServerError: boolean) => {
    setErrorMessage({ message, isServerError });
    timerCloseId.current = window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const clearErrorMessage = () => {
    window.clearTimeout(timerCloseId.current);
    timerCloseId.current = 0;
    setErrorMessage(null);
  };

  const getTodosFromServer = useCallback(async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const response = await todoApi.getTodos();

      setTodosFromServer(response);
    } catch (error) {
      addErrorMessage('Unable to load todos', true);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: todoApi.USER_ID,
      title,
      completed: false,
      isLoading: true,
    };

    setErrorMessage(null);
    setTempTodo(newTodo);

    try {
      const createdTodo = await todoApi.addTodo(newTodo);

      setTodosFromServer(prev => [...prev, createdTodo]);
    } catch (error) {
      addErrorMessage('Unable to add a todo', true);
      throw new Error();
    } finally {
      setTempTodo(null);
    }
  }, []);

  const deleteTodo = async (id: number) => {
    setTodosFromServer(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, isLoading: true } : todo)),
    );
    try {
      await todoApi.deleteTodo(id);
      setTodosFromServer(prev => prev.filter(todo => todo.id !== id));
      inputRef.current?.focus();
    } catch (error) {
      addErrorMessage('Unable to delete a todo', true);
      setTodosFromServer(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, isLoading: false } : todo,
        ),
      );
    }
  };

  const completeTodo = async () => {};

  useEffect(() => {
    getTodosFromServer();
  }, [getTodosFromServer]);

  const filteredTodos = useMemo(() => {
    if (todosFromServer.length === 0) {
      return [];
    }

    return filterTodo(todosFromServer, filter);
  }, [filter, todosFromServer]);

  const isTodoListVisible =
    filteredTodos.length > 0 && !loading && !errorMessage?.isServerError;

  const isTodoFooterVisible =
    todosFromServer.length > 0 && !errorMessage?.isServerError && !loading;

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoContext.Provider
      value={{ onDeleteTodo: deleteTodo, onCompleteTodo: completeTodo }}
    >
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoForm
            todos={todosFromServer}
            inputRef={inputRef}
            onSubmit={addTodo}
            onError={addErrorMessage}
          />
          {isTodoListVisible && (
            <TodoList todos={filteredTodos} tempTodo={tempTodo} />
          )}
          {isTodoFooterVisible && (
            <TodoFooter
              currentFilter={filter}
              todos={todosFromServer}
              onChangeFilter={setFilter}
            />
          )}
        </div>
        <ErrorNotification
          errorMessage={errorMessage?.message}
          onReset={clearErrorMessage}
        />
      </div>
    </TodoContext.Provider>
  );
};
