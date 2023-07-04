/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList';
import { createTodo, getTodos, remove } from './api/api.todos';
import { FilterOption } from './enums/FilterOption';
import { Footer } from './Components/Footer';
import { TodoNotification } from './Components/TodoNotification';
import { Header } from './Components/Header';

const USER_ID = 10898;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(FilterOption.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingTodo, setIsLoadingTodo] = useState<boolean>(false);
  const [activeTodoId, setActiveTodoid] = useState<number | null>(null);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterOption) {
        case FilterOption.Active:
          return !todo.completed;

        case FilterOption.Completed:
          return todo.completed;

        default:
          return FilterOption.All;
      }
    });
  }, [filterOption, todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer) => {
        setError(null);
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError('Unable to upload todos');
      });
  }, []);

  useEffect(() => {
    let errorTimer: number;

    if (error) {
      errorTimer = window.setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimer);
    };
  }, [error]);

  const addTodo = useCallback(async (title: string) => {
    setIsLoadingTodo(true);
    setActiveTodoid(0);

    const newTodo = {
      completed: false,
      title,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo] as Todo[]);
    } catch (err) {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoadingTodo(false);
      setActiveTodoid(null);
    }
  }, []);

  const removeTodo = useCallback((todoId: number) => {
    setActiveTodoid(todoId);

    remove(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setActiveTodoid(null);
      });
  }, []);

  const removeCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => removeTodo(todo.id));
  }, [removeTodo, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const showListAndFooter = todos.length > 0 || tempTodo !== null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoadingTodo={isLoadingTodo}
          addTodo={addTodo}
          setError={setError}
        />

        {showListAndFooter && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              activeTodoId={activeTodoId}
            />

            <Footer
              todos={visibleTodos}
              filterOption={filterOption}
              setFilterOption={setFilterOption}
              removeCompleted={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <TodoNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
