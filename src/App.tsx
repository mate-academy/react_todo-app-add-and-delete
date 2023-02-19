/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { prepareTodos } from './utils/prepareTodos';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { callAddTodo, callDeleteTodo, callGetTodos } from './api/todos';
import { Notifications } from './components/Notifications';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const USER_ID = 6332;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.LOAD);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todosFromServer = await callGetTodos(USER_ID);

        setTodos(todosFromServer);
        setHasError(false);
      } catch (error) {
        setHasError(true);
        if (error instanceof Error) {
          setErrorType(ErrorType.LOAD);
        }
      }
    };

    getTodos();
  }, []);

  const addTodo = useCallback(async (titleOfTodo: string) => {
    if (!titleOfTodo) {
      setErrorType(ErrorType.TITLE);
      setHasError(true);

      return;
    }

    const newTodo: Todo = {
      userId: USER_ID,
      title: titleOfTodo,
      completed: false,
      id: 0,
    };

    try {
      setTempTodo(newTodo);
      const createdTodo = await callAddTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTempTodo(null);

      setTitle('');
      setHasError(false);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await callDeleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorType(ErrorType.DELETE);
      setHasError(true);
    }
  }, []);

  const deleteCompleted = () => {
    const filteredTodos = todos.filter(todo => todo.completed);

    filteredTodos.forEach(todo => deleteTodo(todo.id));
  };

  const visibleTodos = useMemo(() => {
    return prepareTodos(filterBy, todos);
  }, [filterBy, todos]);

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  const notCompletedTodos = todos.filter(todo => !todo.completed).length;

  const isAllTodosActive = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos, notCompletedTodos]);

  const isTodosNotEmpty = !!todos.length;
  const isClearButtonVisible = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllTodosActive={isAllTodosActive}
          isTodosNotEmpty={isTodosNotEmpty}
          title={title}
          onTitleChange={setTitle}
          addTodo={addTodo}
          tempTodo={tempTodo}
        />

        {visibleTodos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            deleteTodo={deleteTodo}
          />
        )}

        {isTodosNotEmpty && (
          <Footer
            filterBy={filterBy}
            onFilterBy={setFilterBy}
            notCompletedTodos={notCompletedTodos}
            isClearButtonVisible={isClearButtonVisible}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>

      <Notifications
        errorType={errorType}
        hasError={hasError}
        clearNotification={clearNotification}
      />
    </div>
  );
};
