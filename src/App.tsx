/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { addTodos, deleteTodos, getTodos } from './api/todos';
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
  const [isCompletedTodoIncludes, setIsCompletedTodoIncludes] = useState(false);

  const getTodosFromServer = async (uri: string) => {
    try {
      setCurrentError('');

      const data = await getTodos(uri);

      setVisibleTodos(data);
      setTodos(data);
      if (data
        .filter(todo => todo.completed)
        .map(filteredTodo => filteredTodo.id).length) {
        setIsCompletedTodoIncludes(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    }
  };

  const addNewTodo = useCallback(async (title: string) => {
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
    }

    setTempTodo(null);
  }, []);

  const removeTodo = useCallback(async (todo: Todo) => {
    try {
      setTempTodo(todo);
      await deleteTodos(`/${todo.id}?userId=${USER_ID}`);
      await getTodosFromServer(`?userId=${USER_ID}`);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    }

    setTempTodo(null);
  }, []);

  const removeAllCompletedTodos = useCallback(() => {
    const currentCompletedTodos = todos.filter(todo => todo.completed);

    setCompletedTodos(currentCompletedTodos);
    currentCompletedTodos.forEach(currentCompletedTodo => (
      removeTodo(currentCompletedTodo)
    ));
    setIsCompletedTodoIncludes(false);
  }, [todos]);

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

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header addNewTodo={addNewTodo} />
        {!(todos.length === 0) && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              tempTodo={tempTodo}
              completedTodos={completedTodos}
            />
            <Footer
              filterTodos={filterTodos}
              countOfActiveTodos={countOfActiveTodos}
              completedTodosCount={isCompletedTodoIncludes}
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
