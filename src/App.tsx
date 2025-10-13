/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';

import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './todos';
import { Todo } from './types/Todo';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TempTodo } from './components/TempTodo';
import { TodoFooter } from './components/TodoFooter';

import { handleSubmit } from './utils/handleSubmit';
import { handleDelete } from './utils/handleDelete';
import { handleClearCompleted } from './utils/handleClearCompleted';
import { handleToggle } from './utils/handleToggle';
import { ErrorNotification } from './components/ErrorNotification';

import { useTodoState } from './types/hooks/useTodoState';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/hooks/errorMessage';

import classNames from 'classnames';

export const App: React.FC = () => {
  const { todos, setTodos, errorMessage, setErrorMessage, filter, setFilter } =
    useTodoState();
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current && !isAdding) {
      inputRef.current.focus();
    }
  }, [isAdding, todos]);

  const completedTodos = todos.filter(todo => todo.completed);
  const hasCompleted = completedTodos.length > 0;
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      {!USER_ID && <UserWarning />}

      {USER_ID && (
        <>
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              isAdding={isAdding}
              inputRef={inputRef}
              onSubmit={event =>
                handleSubmit({
                  event,
                  newTitle,
                  setNewTitle,
                  setTempTodo,
                  setIsAdding,
                  setErrorMessage,
                  setTodos,
                  inputRef,
                })
              }
            />

            <section
              className={classNames('todoapp__main', {
                hidden: todos.length === 0,
              })}
              data-cy="TodoList"
            >
              <TodoList
                todos={visibleTodos}
                deletingTodoIds={deletingTodoIds}
                onDelete={id =>
                  handleDelete(
                    id,
                    setTodos,
                    setErrorMessage,
                    setDeletingTodoIds,
                  )
                }
                hasTodos={todos.length > 0}
                onToggle={(id: number) =>
                  handleToggle(id, todos, setTodos, setErrorMessage)
                }
              />

              {tempTodo && <TempTodo tempTodo={tempTodo} />}
            </section>

            {todos.length > 0 && (
              <TodoFooter
                activeCount={activeCount}
                filter={filter}
                setFilter={setFilter}
                hasCompleted={hasCompleted}
                onClearCompleted={() =>
                  handleClearCompleted(
                    todos,
                    setTodos,
                    setErrorMessage,
                    setDeletingTodoIds,
                  )
                }
              />
            )}

            <ErrorNotification
              message={errorMessage}
              onHide={() => setErrorMessage('')}
            />
          </div>
        </>
      )}
    </div>
  );
};
