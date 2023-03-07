import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';

const USER_ID = 6481;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorType.None);
  const [visibleTodos, setVisibleTodos] = useState(todos);
  const [filterBy, setFilterBy] = useState(FilterBy.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputActive, setIsInputActive] = useState(true);

  const [updatingId, setUpdatingId] = useState([0]);

  const getTodosFromServer = async () => {
    try {
      setErrorMessage(ErrorType.None);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorType.Load);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const allTodosCount = todos.length;

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  useEffect(() => {
    const filteredTodos = (() => {
      switch (filterBy) {
        case FilterBy.All:
          return todos;
        case FilterBy.Active:
          return todos.filter(todo => !todo.completed);
        case FilterBy.Completed:
          return todos.filter(todo => todo.completed);
        default:
          return todos;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [filterBy, todos]);

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorType.Title);

      return;
    }

    const createNewTodo = async () => {
      try {
        setErrorMessage(ErrorType.None);
        const newTodo = {
          userId: USER_ID,
          title,
          completed: false,
        };

        setIsInputActive(false);
        setTempTodo({ ...newTodo, id: 0 });
        await createTodo(USER_ID, newTodo);
        await getTodosFromServer();
      } catch (error) {
        setErrorMessage(ErrorType.Add);
      } finally {
        setTempTodo(null);
        setIsInputActive(true);
      }
    };

    createNewTodo();
  };

  const removeTodo = async (id: number) => {
    try {
      setErrorMessage(ErrorType.None);
      setUpdatingId(prev => [...prev, id]);
      await deleteTodo(USER_ID, id);
      await getTodosFromServer();
    } catch (error) {
      setErrorMessage(ErrorType.Delete);
    } finally {
      setUpdatingId([0]);
    }
  };

  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          isInputActive={isInputActive}
          hasActive={!!activeTodosCount}
        />

        {(!!allTodosCount || !!tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              updatingId={updatingId}
            />

            <Footer
              allTodosCount={allTodosCount}
              activeTodosCount={activeTodosCount}
              filterBy={filterBy}
              onFilterTodos={(status: FilterBy) => setFilterBy(status)}
              onClearCompleted={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {!!errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          onCloseError={() => setErrorMessage(ErrorType.None)}
        />
      )}
    </div>
  );
};
