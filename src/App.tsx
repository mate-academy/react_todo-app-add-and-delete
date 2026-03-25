import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoProvider, TodoContext } from './context/TodoContext';
import { TodoList } from './componentes/TodoList';
import { TodoApp } from './componentes/TodoApp';
import { TodoContextType } from './types/Todo';

const USER_ID = 4095;

const TodosPage: React.FC = () => {
  const context = useContext(TodoContext) as TodoContextType;
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  const {
    errorMessage,
    setErrorMessage,
    todo,
    tempTodo,
    processingTodoIds,
    isCreatingTodo,
    handleCreateTodo,
  } = context;

  useEffect(() => {
    if (!isCreatingTodo && processingTodoIds.length === 0) {
      newTodoFieldRef.current?.focus();
    }
  }, [isCreatingTodo, processingTodoIds]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      newTodoFieldRef.current?.focus();

      return;
    }

    const wasCreated = await handleCreateTodo(newTodoTitle);

    if (wasCreated) {
      setNewTodoTitle('');
    }
  };

  const shouldShowTodoContent = todo.length > 0 || tempTodo !== null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              disabled={isCreatingTodo}
              onChange={event => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        {shouldShowTodoContent && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList />
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <TodoApp />
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoProvider>
      <TodosPage />
    </TodoProvider>
  );
};
