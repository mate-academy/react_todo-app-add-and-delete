/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import {
  USER_ID,
  createTodo,
  destroyTodo,
  getTodos,
} from './api/todos';
import { NewTodo } from './components/NewTodo/NewTodo';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { TodoInfo } from './components/TodoInfo/TodoInfo';

type IsCompleted = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedFilter, setCompletedFilter] = useState<IsCompleted>('all');
  const [isEmptyTitleError, setIsEmptyTitleError] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isCreatingError, setIsCreatingError] = useState(false);
  const [isDeletedError, setIsDeletedError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUploadingTitle, setIsUploadingTitle] = useState(false);
  const [isLoadingTodoId, setIsLoadingTodoId] = useState<number | null>(null);

  const loadTodos = async () => {
    setIsLoadingError(false);
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setIsLoadingError(true);
    }
  };

  const uploadNewTodo = async (title: string) => {
    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });
    setIsUploadingTitle(true);
    try {
      const newTodo = await createTodo(title);

      setTodos(curTodos => [newTodo, ...curTodos]);
    } catch (error) {
      setIsCreatingError(true);
    }

    setIsUploadingTitle(false);

    setTempTodo(null);
  };

  const deleteTodo = async (id: number) => {
    setIsLoadingTodoId(id);
    try {
      await destroyTodo(id);
      setTodos(curTodo => curTodo.filter(todo => todo.id !== id));
    } catch {
      setIsDeletedError(true);
    }

    setIsLoadingTodoId(null);
  };

  const closeAllWarnings = () => {
    setIsLoadingError(false);
    setIsEmptyTitleError(false);
    setIsCreatingError(false);
    setIsDeletedError(false);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => closeAllWarnings(), 3000);
  }, [todos, isEmptyTitleError]);

  const visibleTodos = todos.filter(todo => {
    switch (completedFilter) {
      case ('active'):
        return !todo.completed;

      case ('completed'):
        return todo.completed;

      default:
        return true;
    }
  });

  const isAnyError = isLoadingError || isCreatingError || isEmptyTitleError
    || isDeletedError;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          uploadNewTodo={uploadNewTodo}
          setIsEmptyTitleError={setIsEmptyTitleError}
          isUploadingTitle={isUploadingTitle}
        />
        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            isLoading
            deleteTodo={deleteTodo}
          />
        )}
        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          isLoadingTodoId={isLoadingTodoId}
        />
        {todos.length !== 0 && (
          <Footer
            completedFilter={completedFilter}
            setCompletedFilter={setCompletedFilter}
            todos={todos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className={classNames('notification', 'is-danger', 'is-light',
        'has-text-weight-normal', { hidden: !(isAnyError) })}
      >
        {isLoadingError && <p>Unable to load a todo</p>}
        {isEmptyTitleError && <p>Title can&apos;t be empty </p>}
        {isCreatingError && <p>Unable to add a todo</p>}
        {isDeletedError && <p>Unable to delete a todo</p>}
        <button
          type="button"
          className="delete"
          onClick={closeAllWarnings}
        />
        {/* show only one message at a time */}
        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
