import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { SortType } from './types/SortType';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 6713;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.ALL);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState(0);

  const activeTodosLength = todos.filter((todo) => !todo.completed).length;
  const completedTodosLength = todos.length - activeTodosLength;

  const visibleTodos = useMemo(() => {
    return (todos.filter((todo) => {
      switch (sortType) {
        case SortType.ACTIVE:
          return !todo.completed;
        case SortType.COMPLETE:
          return todo.completed;
        default:
          return true;
      }
    })
    );
  }, [sortType, todos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(ErrorMessage.LOAD);
      }
    };

    fetchData();
  }, []);

  const handleAddTodo = (title: string) => {
    if (title.length === 0) {
      setErrorMessage(ErrorMessage.EMPTY);
      setTimeout(() => setErrorMessage(ErrorMessage.NONE), 3000);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo(newTodo);
      setErrorMessage(ErrorMessage.NONE);

      addTodo(USER_ID, newTodo)
        .then((todo) => {
          setTodos((prevTodos) => {
            return [...prevTodos, todo];
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.ADD);
          setTimeout(() => setErrorMessage(ErrorMessage.NONE), 3000);
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const handleDeleteTodo = useCallback(
    (id: number) => {
      setLoadingTodoId(id);

      return deleteTodo(id)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.filter((todo) => todo.id !== id);
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.DELETE);
          setTimeout(() => setErrorMessage(ErrorMessage.NONE), 3000);
        })
        .finally(() => {
          setTempTodo(null);
          setLoadingTodoId(0);
        });
    },
    [deleteTodo],
  );

  const handleClearCompleted = () => {
    todos.filter((todo) => todo.completed).forEach((todo) => {
      handleDeleteTodo(todo.id)
        .then(() => setTodos(todos.filter(({ completed }) => !completed)));
    });
  };

  const handleToggleTodo = (id: number) => {
    const todoCheck = todos.find((todo) => todo.id === id) as Todo;

    todoCheck.completed = !todoCheck?.completed;

    const notChanged = todos.filter(todo => todo.id !== id);

    setTodos(() => [...notChanged, todoCheck]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosLength={visibleTodos.length}
          onSubmit={handleAddTodo}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          loadingTodoId={loadingTodoId}
          onToggle={handleToggleTodo}
        />

        {todos.length && (
          <Footer
            sortType={sortType}
            setSortType={setSortType}
            activeTodosLength={visibleTodos.length}
            completedTodosLength={completedTodosLength}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {errorMessage && (
        <Errors
          errorMessage={errorMessage}
          closeError={() => setErrorMessage(ErrorMessage.NONE)}
        />
      )}
    </div>
  );
};
