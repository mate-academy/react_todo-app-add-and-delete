import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorTypes } from './types/ErrorTypes';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoItem } from './components/TodoItem';
import { FilterTypes } from './types/FilterTypes';

const USER_ID = 10905;

export const App: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterTypes.ALL);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([0]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes>();

  const titleField = useRef<HTMLInputElement>(null);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const showAndDeleteError = () => {
    setIsError(true);

    return setTimeout(() => setIsError(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorTypes.TITLE);
      setTitle('');

      return showAndDeleteError();
    }

    setIsDisabled(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    addTodos({
      title,
      userId: USER_ID,
      completed: false,
    })
      .then((res) => {
        setTodos(prevTodos => [...prevTodos, res]);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.ADD);
        showAndDeleteError();
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });

    return setTitle('');
  };

  const filterTodos = (filterTodosBy: FilterTypes) => {
    switch (filterTodosBy) {
      case FilterTypes.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodosId(prevTodos => [...prevTodos, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(prevTodos => [...prevTodos
          .filter(todo => todo.id !== todoId)]);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.DELETE);
        showAndDeleteError();
      })
      .finally(() => {
        setLoadingTodosId(prevLoadingTodos => [...prevLoadingTodos
          .filter(Id => Id !== todoId)]);
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.LOAD);
        showAndDeleteError();
      });

    return () => {
      clearTimeout(showAndDeleteError());
    };
  }, []);

  useEffect(() => {
    if (!isDisabled) {
      return;
    }

    setTimeout(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, 400);
  }, [isDisabled]);

  const visibleTodos = useMemo(() => {
    return filterTodos(selectedFilter);
  }, [selectedFilter, todos]);

  const todosLeftToFinish = useMemo(() => {
    return filterTodos(FilterTypes.ACTIVE);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            aria-label="To complete all todos"
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              ref={titleField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={isDisabled}
              onChange={handleChangeTitle}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              loadingTodosId={loadingTodosId}
              handleDeleteTodo={handleDeleteTodo}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                loadingTodosId={loadingTodosId}
                handleDeleteTodo={handleDeleteTodo}
              />
            )}
            <Footer
              todos={todos}
              handleDeleteTodo={handleDeleteTodo}
              todosLeftToFinish={todosLeftToFinish}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
            />
          </>
        )}
      </div>

      <ErrorMessage
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
