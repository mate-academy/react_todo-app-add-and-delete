/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6397;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentError, setCurrentError] = useState('');
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodoLength, setCompletedTodoLength] = useState(0);

  const getTodosFromServer = async (uri: string) => {
    try {
      setCurrentError('');

      const data = await getTodos(uri);

      setVisibleTodos(data);
      setTodos(data);

      const completedTodoLenth = data.filter(todo => todo.completed);

      setCompletedTodoLength(completedTodoLenth.length);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    }
  };

  const addNewTodo = useCallback(async (title: string) => {
    setCurrentError('');

    const data = {
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setTempTodo({ ...data, id: 0 });

      const responseTodo = await addTodos(`?userId=${USER_ID}`, data);

      setTodos(currentTodos => [...currentTodos, responseTodo]);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (todo: Todo) => {
    try {
      setCurrentError('');
      setTempTodo(todo);
      await deleteTodos(`/${todo.id}?userId=${USER_ID}`);
      await getTodosFromServer(`?userId=${USER_ID}`);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setCompletedTodoLength(completedTodos.length);
      setTempTodo(null);
    }
  }, []);

  const removeAllCompletedTodos = useCallback(() => {
    const currentCompletedTodos = todos.filter(todo => todo.completed);

    setCompletedTodos(currentCompletedTodos);
    currentCompletedTodos.forEach(currentCompletedTodo => (
      removeTodo(currentCompletedTodo)
    ));
    setCompletedTodoLength(0);
  }, [todos]);

  const updateTodoStatus = useCallback(async (
    isCompleted: boolean,
    todo: Todo,
  ) => {
    try {
      setCurrentError('');
      setTempTodo(todo);
      await updateTodos(`/${todo.id}?userId=${USER_ID}`, { completed: isCompleted });
      await getTodosFromServer(`?userId=${USER_ID}`);

      if (completedTodos.find(t => todo.id === t.id)) {
        setCompletedTodos(currentCompletedTodos => (
          currentCompletedTodos.filter(currentTodo => (
            currentTodo.id !== todo.id
          ))
        ));
      }
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setTempTodo(null);
    }
  }, [completedTodos]);

  const updateAllTodosStatus = useCallback((isCompleted: boolean) => {
    const updatedTodos = todos.filter(todo => todo.completed !== isCompleted);

    setCompletedTodos(updatedTodos);
    updatedTodos.forEach(async activeTodo => {
      await updateTodoStatus(isCompleted, activeTodo);
    });

    if (isCompleted) {
      setCompletedTodoLength(todos.length);
    } else {
      setCompletedTodoLength(0);
    }
  }, [todos]);

  const updateTodoTitle = useCallback(async (title: string, todo: Todo) => {
    try {
      setCurrentError('');
      setTempTodo(todo);
      await updateTodos(`/${todo.id}?userId=${USER_ID}`, { title });
      await getTodosFromServer(`?userId=${USER_ID}`);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setTempTodo(null);
    }
  }, []);

  useEffect(() => {
    getTodosFromServer(`?userId=${USER_ID}`);
  }, []);

  useEffect(() => {
    setVisibleTodos(todos);
  }, [todos]);

  const removeError = useCallback(() => {
    setCurrentError('');
  }, []);

  const filterTodos = useCallback((type: Filter) => {
    switch (type) {
      case Filter.All:
        setVisibleTodos(todos);
        break;
      case Filter.Active:
        setVisibleTodos(todos.filter((todo => !todo.completed)));
        break;
      case Filter.Completed:
        setVisibleTodos(todos.filter((todo => todo.completed)));
        break;
      default:
        setVisibleTodos(todos);
    }
  }, [todos]);

  const countOfActiveTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const isAllTodosCompleted = useMemo(() => {
    return todos.length === completedTodoLength && !!todos.length;
  }, [todos, completedTodoLength]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          addNewTodo={addNewTodo}
          updateAllTodosStatus={updateAllTodosStatus}
          isAllTodosCompleted={isAllTodosCompleted}
        />
        {!(todos.length === 0) && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              tempTodo={tempTodo}
              completedTodos={completedTodos}
              updateTodoStatus={updateTodoStatus}
              updateTodoTitle={updateTodoTitle}
            />
            <Footer
              filterTodos={filterTodos}
              countOfActiveTodos={countOfActiveTodos}
              completedTodoLength={completedTodoLength}
              removeAllCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>
      {currentError && (
        <ErrorNotification
          error={currentError}
          removeError={removeError}
        />
      )}
    </div>
  );
};
