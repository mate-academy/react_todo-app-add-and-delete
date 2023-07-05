/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorTypes } from './types/ErrorTypes';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoItem } from './components/TodoItem';

const USER_ID = 10905;

export const App: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
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
    setTimeout(() => setIsError(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      setErrorMessage(ErrorTypes.TITLE);
      showAndDeleteError();
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
        setIsDisabled(false);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.ADD);
        showAndDeleteError();
        setIsDisabled(false);
        setTempTodo(null);
      });

    setTitle('');
  };

  const filterTodos = (filterTodosBy: string) => {
    switch (filterTodosBy) {
      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);

      case 'All':
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
        setLoadingTodosId(prevLoadingTodos => [...prevLoadingTodos
          .filter(Id => Id !== todoId)]);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.DELETE);
        showAndDeleteError();
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
  }, []);

  useEffect(() => {
    if (isDisabled) {
      setTimeout(() => {
        if (titleField.current) {
          titleField.current.focus();
        }
      }, 400);
    }
  }, [isDisabled]);

  const visibleTodos = filterTodos(selectedFilter);
  const todosLeftToFinish = filterTodos('Active');

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

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
