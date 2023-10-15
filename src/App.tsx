/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
// import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import * as TodoSevise from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';

const filterTodos = (todos: Todo[], filterStatus: Status): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');

  const visibleTodos = filterTodos(todos, status);
  const hasCompleted = todos.some(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleLoading = (todoId: number[]) => {
    setIsLoading(prevArray => prevArray.concat(todoId));
  };

  const handleFilterStatus = (todosStatus: Status) => (
    setStatus(todosStatus));

  useEffect(() => {
    TodoSevise.getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const timerId: React.MutableRefObject<number> = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage, isDisabled]);

  const handleAddTodo = (titleTodo: string) => {
    return TodoSevise.addTodo(titleTodo.trim())
      .then((newTodo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
        setIsDisabled(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        throw new Error();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsDisabled(true);
    setIsLoading(prevArray => [...prevArray, todoId]);

    TodoSevise.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsDisabled(false);
        setIsLoading([]);
      });
  };

  const handleUpdateTodo = (todo: Todo, newTitle: string) => {
    TodoSevise.updateTodo({
      id: todo.id,
      title: newTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then((updatedTodo) => {
        setTodos(prevState => prevState
          .map(currentTodo => (
            currentTodo.id !== updatedTodo.id
              ? currentTodo
              : updatedTodo
          )));
      });
  };

  const handleToggleChange = (todo: Todo) => {
    TodoSevise.updateTodo({
      id: todo.id,
      title: todo.title,
      userId: todo.userId,
      completed: !todo.completed,
    })
      .then((updatedTodo) => {
        setTodos(prevState => prevState
          .map(currentTodo => (
            currentTodo.id !== updatedTodo.id
              ? currentTodo
              : updatedTodo
          )));
      });
  };

  const handelClearComplited = () => {
    const allCompleatedTodos = todos.filter(todo => todo.completed === true);

    allCompleatedTodos.forEach(todo => (
      setIsLoading(prevArray => [...prevArray, todo.id])
    ));

    Promise.all(allCompleatedTodos.map(todo => TodoSevise.deleteTodo(todo.id)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => (
        setErrorMessage('Unable to delete a todo')
      ))
      .finally(() => {
        setIsLoading([]);
        setIsDisabled(false);
      });

    /*     allCompleatedTodos.forEach(({ id }) => (
          handleDeleteTodo(id)
        )); */
  };

  /* if (!USER_ID) {
    return <UserWarning />;
  } */

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onToddoAdd={handleAddTodo}
          onToggleChange={handleToggleChange}
          todos={visibleTodos}
          inputRef={inputRef}
          setTempTodo={setTempTodo}
          setIsDisabled={setIsDisabled}
          setErrorMessage={setErrorMessage}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isDisabled={isDisabled}
        />
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              onTodoDelete={handleDeleteTodo}
              isLoading={isLoading}
              handleLoading={handleLoading}
              key={todo.id}
              onTodoUpdate={handleUpdateTodo}
              onToggleChange={handleToggleChange}
            />
          ))}

          {(tempTodo) && (
            <TodoItem
              todo={tempTodo}
              onTodoDelete={handleDeleteTodo}
              isLoading={isLoading}
              handleLoading={handleLoading}
              onTodoUpdate={handleUpdateTodo}
              onToggleChange={handleToggleChange}
              key={tempTodo.id}
            />
          )}
        </section>
        {/* Hide the footer if there are no todos */}
        {Boolean(todos.length)
          && (
            <Footer
              onFilterStatus={handleFilterStatus}
              todosFilterStatus={status}
              onDeleteCompleated={handelClearComplited}
              hasCompleted={hasCompleted}
              activeTodosCount={activeTodosCount}
            />
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage.length },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        {/* show only one message at a time */}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
