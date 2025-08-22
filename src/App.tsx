/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { ToDo } from './components/ToDo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const mainInput = useRef<HTMLInputElement>(null);

  const allErrors = {
    loadingTodos: 'Unable to load todos',
    addingTodo: 'Unable to add a todo',
    deletingTodo: 'Unable to delete a todo',
    checkingEmptyTitle: 'Title should not be empty',
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterBy === Filter.active) {
        return !todo.completed;
      }

      if (filterBy === Filter.completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterBy]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setError('');

    return todosService
      .addTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
      })
      .catch(e => {
        setError(allErrors.addingTodo);
        throw e;
      });
  }

  function deleteTodo(id: number) {
    setDeletingId(id);

    setDeletingIds(ids => [...ids, id]);

    return todosService
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        mainInput.current?.focus();
      })
      .catch(e => {
        setError(allErrors.deletingTodo);
        throw e;
      })
      .finally(() => {
        setDeletingId(null);
        setDeletingIds(ids => ids.filter(item => item !== id));
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError(allErrors.checkingEmptyTitle);
      mainInput.current?.focus();

      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: todosService.USER_ID,
    });

    addTodo({
      title: normalizedTitle,
      completed: false,
      userId: todosService.USER_ID,
    })
      .then(() => {
        setTitle('');
        setTempTodo(null);
        mainInput.current?.focus();
      })
      .catch(() => setTempTodo(null))
      .finally(() => setIsSubmitting(false));
  }

  function handleActive(id: number) {
    setTodos(tds => {
      return tds.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
    });
  }

  useEffect(() => {
    mainInput.current?.focus();

    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setError(allErrors.loadingTodos));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!isSubmitting) {
      setTimeout(() => mainInput.current?.focus(), 0);
    }
  }, [isSubmitting]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        todos={todos}
        setTodos={setTodos}
        title={title}
        setTitle={setTitle}
        mainInput={mainInput}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <div className="todoapp__content">
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <ToDo
              handleActive={handleActive}
              todo={todo}
              deleteTodo={deleteTodo}
              isDeleting={deletingId === todo.id}
              isDeletingSeveral={deletingIds.includes(todo.id)}
              key={todo.id}
            />
          ))}
          {tempTodo && (
            <ToDo
              handleActive={handleActive}
              todo={tempTodo}
              deleteTodo={deleteTodo}
              isDeleting={deletingId === tempTodo.id}
              isDeletingSeveral={deletingIds.includes(tempTodo.id)}
              isSubmitting={isSubmitting}
            />
          )}
          {/* This todo is being edited */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}
          {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitlemainInput"
                type="text"
                className="todo__title-mainInput"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        </section>

        {todos.length > 0 && (
          <Footer
            filterBy={filterBy}
            activeCount={activeCount}
            setFilterBy={setFilterBy}
            visibleTodos={visibleTodos}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
