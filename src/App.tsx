/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterBy } from './types/FilterBy';
import { warningTimer } from './utils/warningTimer';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6316;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [todosLoadingState, setTodosLoadingState] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NOUN);

  const countActiveTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const showErrorMessage = useCallback((message: ErrorMessages) => {
    setHasError(true);
    setErrorMessage(message);
  }, []);

  useEffect(() => {
    const onLoadGetTodos = async () => {
      try {
        const todosData = await getTodos(USER_ID);

        setTodos(todosData);
      } catch (error) {
        showErrorMessage(ErrorMessages.ONLOAD);
      }
    };

    onLoadGetTodos();
  }, []);

  useEffect(() => {
    if (hasError) {
      warningTimer(setHasError, false, 3000);
    }
  }, [hasError]);

  const handleAddTodo = async (title: string) => {
    setHasError(false);

    if (!title) {
      showErrorMessage(ErrorMessages.EMPTY);

      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsInputDisabled(true);
      setTempTodo(newTodo);

      const addedTodo = await addTodo(USER_ID, newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch (error) {
      showErrorMessage(ErrorMessages.ONADD);
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const handleRemoveTodo = async (removingTodo: Todo) => {
    setHasError(false);

    try {
      setTodosLoadingState(currentTodos => [...currentTodos, removingTodo]);
      await deleteTodo(USER_ID, removingTodo.id);

      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== removingTodo.id));
    } catch (error) {
      showErrorMessage(ErrorMessages.ONDELETE);
    } finally {
      setTodosLoadingState(currentTodos => currentTodos
        .filter(todo => todo.id !== removingTodo.id));
    }
  };

  const removeCompletedTodo = async () => {
    const compeletedTodos = todos.filter(todo => todo.completed);

    try {
      setTodosLoadingState(currentTodos => (
        [...currentTodos, ...compeletedTodos]
      ));
      await Promise.all(
        compeletedTodos.map(todo => deleteTodo(USER_ID, todo.id)),
      );

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      showErrorMessage(ErrorMessages.ONDELETE);
    } finally {
      setTodosLoadingState(currentTodos => (
        currentTodos.filter(todo => !compeletedTodos
          .some(complTodo => complTodo.id === todo.id))
      ));
    }
  };

  const handleHasError = (isError: boolean) => {
    setHasError(isError);
  };

  const handleFilterBy = (filterType: FilterBy) => {
    setFilterBy(filterType);
  };

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, filterBy)
  ), [todos, filterBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          someActiveTodos={countActiveTodos}
          isInputDisabled={isInputDisabled}
          onSubmitAddTodo={handleAddTodo}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          todosLoadingState={todosLoadingState}
          onClickRemoveTodo={handleRemoveTodo}
        />

        {!!todos.length && (
          <Footer
            quantity={countActiveTodos}
            filterBy={filterBy}
            setFilterBy={handleFilterBy}
            hasCompletedTodos={hasCompletedTodos}
            onRemoveCompletedTodo={removeCompletedTodo}
          />
        )}
      </div>

      <Notification
        hasError={hasError}
        setHasError={handleHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
