/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodoFilteredByCompleted } from './api/helper';
import { createTodo, deleteTodoById, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user?.id)
        .then((loadedTodos) => {
          setTodos(loadedTodos);
        })
        .catch(() => {
          setIsError(true);
          setErrorMessage('Something went wrong');
        });
    }
  }, []);

  const closeErrorMassage = useCallback(() => {
    setIsError(false);
  }, []);

  const deleteTodo = async (todoId: number) => {
    try {
      const deleteResponse = await deleteTodoById(todoId);

      // eslint-disable-next-line max-len
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));

      return deleteResponse;
    } catch (error) {
      setIsError(false);
      setErrorMessage('Unable to delete a todo');

      return false;
    }
  };

  const addTodo = async (newTitle: string) => {
    if (user) {
      setIsNewTodoLoading(true);

      setTempTodo({
        id: 0,
        userId: user.id,
        title: newTitle,
        completed: false,
      });

      const newTodo = {
        userId: user?.id,
        title: newTitle,
        completed: false,
      };

      try {
        const response = await createTodo(newTodo);

        setTodos((prevTodos) => [...prevTodos, response]);

        return response;
      } catch (error) {
        setErrorMessage('Unable to add a todo');

        return false;
      } finally {
        setTempTodo(null);
        setIsNewTodoLoading(false);
      }
    }

    return false;
  };

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

  const visibleTodos = useMemo(
    () => getTodoFilteredByCompleted(todos, filterStatus),
    [todos, filterStatus],
  );

  const amountOfItems = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  );

  const completedTodosLength = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  const deleteCompletedTodos = useCallback(() => {
    todos.forEach((todo) => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setIsError={setIsError}
          onErrorMessage={setErrorMessage}
          onAddTodo={addTodo}
          isNewTodoLoading={isNewTodoLoading}
        />

        <TodoList
          todos={visibleTodos}
          onDeleteTodo={deleteTodo}
          tempTodo={tempTodo}
          isNewTodoLoading={isNewTodoLoading}
        />

        {Boolean(todos.length) && (
          <Footer
            filterStatus={filterStatus}
            onFilterStatus={setFilterStatus}
            amountOfItems={amountOfItems}
            onDeleteCompletedTodos={deleteCompletedTodos}
            completedTodosLength={completedTodosLength}
          />
        )}
      </div>

      <ErrorNotification
        isError={isError}
        errorMessage={errorMessage}
        onCloseError={closeErrorMassage}
      />
    </div>
  );
};
