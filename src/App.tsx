/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { TodoFilters } from './components/TodoFilters/TodoFilters';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadError, setIsLoadError] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);
  const [isRemoveError, setIsRemoveError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filtredTodos, setFiltredTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [isTodoRemove, setIsTodoRemove] = useState(false);

  const user = useContext(AuthContext);

  console.log(todos);
  console.log(isTodoRemove);

  // console.log(isUploadError);

  const loadTodosFromServer = async () => {
    try {
      if (user) {
        const getTodosFromServer = await getTodos(user.id);

        setTodos(getTodosFromServer);
      }
    } catch (error) {
      setIsLoadError(true);
    }
  };

  const uploadTodosOnServer = async () => {
    if (user) {
      try {
        const currentTodo = {
          id: 0,
          userId: user?.id,
          title,
          completed: false,
        };

        setTempTodo(currentTodo);

        const newTodo = await createTodo(currentTodo);

        setTodos(prev => [...prev, newTodo]);

        setIsTodoLoading(true);
      } catch (error) {
        setIsUploadError(true);
        setTodos(todos);
      } finally {
        setIsTodoLoading(false);
        setTempTodo(null);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsTodoLoading(true);

    if (title !== '') {
      setTitle('');
      uploadTodosOnServer();
    } else {
      setIsEmptyTitle(true);
    }
  };

  const removeTodoFromServer = async (id: number) => {
    setIsTodoRemove(true);
    try {
      deleteTodo(id);
    } catch (error) {
      setIsRemoveError(true);
    } finally {
      setIsRemoveError(false);
    }

    setIsTodoRemove(false);
  };

  const hendleRemoveTodo = (id: number) => {
    removeTodoFromServer(id);
    const visibleTodos = filtredTodos.filter(todo => {
      return todo.id !== id;
    });

    setTodos(visibleTodos);
  };

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadError(false);
      setIsEmptyTitle(false);
    }, 3000);

    clearTimeout(timer);
  }, [isLoadError, isEmptyTitle]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">

        <NewTodoField
          handleSubmitForm={handleSubmit}
          onChange={(value: string) => setTitle(value)}
          value={title}
          isUploadError={isUploadError}
        />
        <TodoList
          filtredTodos={filtredTodos}
          isTodoLoading={isTodoLoading}
          hendleRemoveTodo={hendleRemoveTodo}
          isTodoRemove={isTodoRemove}
          tempTodo={tempTodo}
        />
        <TodoFilters
          todos={todos}
          setFiltredTodos={setFiltredTodos}
        />
      </div>

      {isLoadError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsLoadError(false)}
          />

          Unable to load a todos
        </div>
      )}

      {isEmptyTitle && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsEmptyTitle(false)}
          />

          Title can&apos;t be empty
        </div>
      )}

      {isUploadError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsUploadError(false)}
          />

          Unable to add a todo
        </div>
      )}

      {isRemoveError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsRemoveError(false)}
          />

          Unable to delete a todo
        </div>
      )}
    </div>
  );
};
