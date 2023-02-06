import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes, FilterTypes } from './types/Enums';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleButtonClickAll = () => {
    setFilterType(FilterTypes.All);
  };

  const handleButtonClickActive = () => {
    setFilterType(FilterTypes.ACTIVE);
  };

  const handleButtonClickCompleted = () => {
    setFilterType(FilterTypes.COMPLETED);
  };

  const addNewTodo = useCallback(async (newTitle: string) => {
    if (!newTitle.trim()) {
      setIsError(true);
      setErrorMessage(ErrorTypes.EmptyTitle);

      return;
    }

    setIsLoading(true);

    if (user) {
      try {
        setTempTodo({
          id: 0,
          title: newTitle.trim(),
          completed: false,
          userId: user.id,
        });

        const newTodo = await addTodo({
          title: newTitle.trim(),
          userId: user?.id,
          completed: false,
        });

        setTodos(prev => [...prev, newTodo]);
        setErrorMessage('');
        setIsError(false);
      } catch (error) {
        setIsError(true);
        setErrorMessage(ErrorTypes.UnableToAdd);
      } finally {
        setIsLoading(false);
        setTempTodo(null);
      }
    }
  }, [user]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodosIds(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setErrorMessage('');
      setIsError(false);
    } catch (error) {
      setErrorMessage('todo is not delete');
      setIsError(true);
    } finally {
      setDeletingTodosIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const deleteCompleated = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterTypes.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterTypes.All:
        return todos;

      default:
        throw new Error('Invalid sorting type');
    }
  }, [todos, filterType]);

  if (isError) {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }

  const handleCloseErrorMessage = () => {
    setIsError(false);
  };

  const incompletedTodos = visibleTodos.filter(todo => !todo.completed);
  const completedTodosAmount = visibleTodos
    .filter(todo => todo.completed).length;

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setIsError(true);
          setErrorMessage(ErrorTypes.UnableToLoad);
        });
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [user]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isLoading={isLoading}
          onAddTodo={addNewTodo}
        />
        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              isLoading={isLoading}
              deletingTodosIds={deletingTodosIds}
            />

            <Footer
              filterType={filterType}
              incompletedTodos={incompletedTodos}
              handleButtonClickAll={handleButtonClickAll}
              handleButtonClickActive={handleButtonClickActive}
              handleButtonClickCompleted={handleButtonClickCompleted}
              completedTodosAmount={completedTodosAmount}
              deleteCompleated={deleteCompleated}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          isError={isError}
          onCloseErrorMessage={handleCloseErrorMessage}
        />
      )}
    </div>
  );
};
