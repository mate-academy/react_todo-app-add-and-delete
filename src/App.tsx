import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';
import { SortType } from './types/SortType';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 10354;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [sortType, setSortType] = useState(SortType.All);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isConnection, setIsConnection] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessageName, setErrorMessageName] = useState<string | null>(null);
  const [todosLoading, setTodosLoading] = useState<number[]>([]);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCreateTodo = () => {
    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTodosLoading((prevState) => [...prevState, 0]);

    setTempTodo(newTodo);

    postTodos(USER_ID, newTodo)
      .then((response) => {
        setTodos((prevTodos) => [...prevTodos, response]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setIsConnection(false);
        setIsErrorMessage(true);
        setErrorMessageName(ErrorMessages.AddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setTodosLoading((prevState) => prevState.filter((id) => id));
      });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    if (!title) {
      setIsErrorMessage(true);
      setErrorMessageName(ErrorMessages.TitleIsEmpty);
    } else if (title.trim()) {
      handleCreateTodo();
      setTitle('');
    }
  };

  const closeErrorMessage = () => {
    setIsErrorMessage(false);
  };

  const sortBy = {
    sortByAll: () => {
      setSortType(SortType.All);
    },

    sortByActive: () => {
      setSortType(SortType.Active);
    },

    sortByCompleted: () => {
      setSortType(SortType.Completed);
    },
  };

  const handleRemoveTodo = (todoId: number) => {
    setTodosLoading((prevState) => [...prevState, todoId]);

    return deleteTodos(todoId)
      .then(() => getTodos(USER_ID))
      .then((prevTodos: Todo[]) => {
        setTodos(prevTodos);
      })
      .catch(() => {
        setIsErrorMessage(true);
        setErrorMessageName(ErrorMessages.DeleteTodo);
      })
      .finally(() => {
        setTodosLoading((prevState) => prevState.filter((id) => id !== todoId));
      });
  };

  const visibleTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      switch (sortType) {
        case SortType.Active:
          return !todo.completed;
        case SortType.Completed:
          return todo.completed;
        default:
          return todos;
      }
    });
  }, [todos, sortType]);

  const handleRemoveCompleted = useCallback(() => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    Promise.all(completedTodoIds.map((todoId) => handleRemoveTodo(todoId)))
      .then(() => getTodos(USER_ID))
      .then((prevTodos: Todo[]) => {
        setTodos(prevTodos);
        setIsConnection(true);
      })
      .catch(() => {
        setIsErrorMessage(true);
        setErrorMessageName(ErrorMessages.DeleteTodo);
      });
  }, [todos]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .then(() => setIsConnection(true))
      .catch(() => {
        setIsErrorMessage(true);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          handleChange={handleChangeTitle}
          handleKeyUp={handleKeyUp}
          todosLoading={todosLoading}
        />

        <TodoList
          visibleTodos={visibleTodos}
          remove={handleRemoveTodo}
          tempTodo={tempTodo}
          isConnection={isConnection}
          todosLoading={todosLoading}
        />

        <Footer
          sortType={sortType}
          sortBy={sortBy}
          todos={todos}
          removeCompleted={handleRemoveCompleted}
        />
      </div>

      <Notification
        isErrorMessage={isErrorMessage}
        closeErrorMessage={closeErrorMessage}
        errorMessage={errorMessageName}
      />
    </div>
  );
};
