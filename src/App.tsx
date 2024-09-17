/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { getFilteredTodos } from './utils/TodosFilter';
import { Error } from './types/Error';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);
  const [todoIdToDelete, setTodoIdToDelete] = useState(0);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const titleField = useRef<HTMLInputElement>(null);

  function createTodo(todo: Omit<Todo, 'id'>) {
    setIsPostLoading(true);

    addTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Error.POST);
      })
      .finally(() => {
        setIsPostLoading(false);
        setTempTodo(null);
      });

    setTempTodo({ ...todo, id: 0 });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Error.TITLE);

      return;
    }

    createTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });
  }

  function removeTodo(todoId: number) {
    setTodoIdToDelete(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Error.DELETE);
      })
      .finally(() => setTodoIdToDelete(0));
  }

  function clearAllCompleted() {
    setIsClearLoading(true);

    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.allSettled(completedIds.map(id => deleteTodo(id)))
      .then(responses => {
        const idsToRemove: number[] = [];
        const hasRejected = responses.some(
          response => response.status === 'rejected' || response.value === 0,
        );

        responses.forEach((response, index) => {
          if (response.status === 'fulfilled' && response.value) {
            idsToRemove.push(completedIds[index]);
          }
        });

        if (hasRejected) {
          setErrorMessage(Error.DELETE);
        }

        if (idsToRemove.length) {
          setTodos(currentTodos =>
            currentTodos.filter(todo => !idsToRemove.includes(todo.id)),
          );
        }
      })
      .catch(() => setErrorMessage(Error.DELETE))
      .finally(() => setIsClearLoading(false));
  }

  useEffect(() => {
    if (
      titleField.current &&
      !isPostLoading &&
      !todoIdToDelete &&
      !isClearLoading
    ) {
      titleField.current.focus();
    }
  }, [isPostLoading, todoIdToDelete, isClearLoading]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.GET);
      });
  }, []);

  const preparedTodos = getFilteredTodos(todos, filterStatus);

  const activeTodosCount = useMemo(() => {
    return todos?.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodo = useMemo(() => {
    return todos?.some(todo => todo.completed);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.length,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              disabled={isPostLoading}
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={titleField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          todos={preparedTodos}
          tempTodo={tempTodo}
          deleteTodo={removeTodo}
          todoIdToDelete={todoIdToDelete}
          isClearLoading={isClearLoading}
        />

        {todos.length > 0 && (
          <Footer
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            activeTodosCount={activeTodosCount}
            hasCompletedTodo={hasCompletedTodo}
            clearAllCompleted={clearAllCompleted}
          />
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        message={errorMessage}
      />
    </div>
  );
};
