/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
//#region Imports
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType, FILTERS } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useVisibleTodos } from './hooks/useVisibleTodos';
import { useTodoStatistics } from './hooks/useTodoStatistics';
import * as todoService from './api/todos';
//#endregion

export const App: React.FC = () => {
  //#region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);

  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  //#endregion
  //#region Refs
  const newTodoRef = useRef<HTMLInputElement>(null);
  //#endregion
  //#region Values
  const visibleTodos = useVisibleTodos(todos, filter);
  const { allComplete, activeCount, hasCompleted } = useTodoStatistics(todos);

  //#endregion
  //#region Effects
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    newTodoRef.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.LOAD_TODOS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAdding && deleteIds.length === 0) {
      newTodoRef.current?.focus();
    }
  }, [isAdding, deleteIds]);
  //#endregion
  //#region Conditionals
  if (!USER_ID) {
    return <UserWarning />;
  }

  //#endregion
  //#region handles
  function handleAddTodo() {
    setError(null);

    const trimmed = newTitle.trim();

    if (!trimmed) {
      setError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);
    setIsAdding(true);

    todoService
      .createTodo(trimmed)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  }

  function handleDeleteTodo(id: number) {
    setError(null);

    setDeleteIds(current => [...current, id]);

    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessage.DELETE_TODO);
      })
      .finally(() => {
        setDeleteIds(current => current.filter(todoId => todoId !== id));
      });
  }

  function handleClearCompleted() {
    setError(null);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeleteIds(current => [...current, ...completedIds]);

    const deletePromises = completedIds.map(id =>
      todoService
        .deleteTodo(id)
        .then(() => {
          setTodos(current => current.filter(todo => todo.id !== id));
        })
        .catch(() => {
          setError(ErrorMessage.DELETE_TODO);
        })
        .finally(() => {
          setDeleteIds(current => current.filter(todoId => todoId !== id));
        }),
    );

    Promise.all(deletePromises);
  }
  //#endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allComplete={allComplete}
          newTodoRef={newTodoRef}
          newTitle={newTitle}
          onTitleChange={setNewTitle}
          onSubmit={handleAddTodo}
          isAdding={isAdding}
        />

        {isLoading && <div data-cy="TodoLoader" className="loader"></div>}

        {!isLoading && (todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            isLoading={isLoading}
            deleteIds={deleteIds}
            onDelete={handleDeleteTodo}
            tempTodo={tempTodo}
          />
        )}

        {!isLoading && todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            hasCompleted={hasCompleted}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
