/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodos, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import classNames from 'classnames';

export enum TodoStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}


export const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<TodoStatus>(TodoStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  useEffect(() => {
    if (USER_ID) {
      handleRequest();
    }

    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  // Sends a request to the server to get a list (todos).
  const handleRequest = async () => {
    try {
      const allTodo = await getTodos();

      setTodos(allTodo);
      setError(null);
    } catch (errors) {
      setError('Unable to load todos');
    }
  };

  const isLoading = !!loadingTodoIds.length;

  const inputRef = useRef<HTMLInputElement>(null);
  // adds focus to the input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  // form event handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    try {
      setTempTodo({
        id: 0,
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      // function 'createTodos', sends a request to the server and creates a new 'todo'
      const newTodo = await createTodos({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      // adds a new element to the todos array and updates its state
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
    } catch (errors) {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const deleteSingleTodo = async (userId: number) => {

    try {
      setLoadingTodoIds(prevLoading => [...prevLoading, userId]); // Set download status for selected todo
      await deleteTodo(userId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== userId));
    } catch (errors) {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(prevLoading => prevLoading.filter(id => id !== userId)); // Clearing the download status after the operation
    }
  };

  // The function is responsible for changing the task status
  const toggleTodoCompletion = (todoId: number) => {
    try {
      // get a link to the task by its 'id'
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      );

      // Updating the status of todos
      setTodos(updatedTodos);
      setError(null);

      // get a new state of the filter
      let newFilterStatus: TodoStatus = TodoStatus.All;

      if (filterStatus === TodoStatus.Completed) {
        newFilterStatus = TodoStatus.Completed;
      } else if (filterStatus === TodoStatus.Active) {
        newFilterStatus = TodoStatus.All;
      }

      // update the filter status
      setFilterStatus(newFilterStatus);
    } catch (errors) {
      setError('Unable to toggle todo completion');
    }
  };

  const clearCompletedTodos = async () => {
    try {
      // Selection of completed todos
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      // Deleting each completed todo by its ID
      await Promise.all(completedTodosIds.map(id => deleteSingleTodo(id)));
      // Updating the todos list, excluding completed todos
      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));

      if (todos.some(todo => !todo.completed)) {
        setFilterStatus(TodoStatus.Completed);
      }
    } finally {
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          onSubmit={handleSubmit}
          onChange={setTitle}
          todos={todos}
          isLoading={isLoading}
          inputRef={inputRef}
          title={title}
        />

        <Main
          filteredTodos={filteredTodos}
          toggleTodoCompletion={toggleTodoCompletion}
          loadingTodoIds={loadingTodoIds}
          deleteSingleTodo={deleteSingleTodo}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames('notification', 'is-danger', 'is-light', 'has-text-weight-normal', { 'hidden': isLoading || !error })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
}
