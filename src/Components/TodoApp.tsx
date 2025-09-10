import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StatusFilter, Todo, MessageError } from '../types/Todo';

import * as todoService from '../api/todos';
import { TodoHeader } from './TodoHeader';
import { TodoMain } from './TodoMain';
import { TodoFooter } from './TodoFooter';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessege, setErrorMessege] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const focusInput = useRef<() => void>();

  const focusInputFn = useCallback((fn: () => void) => {
    focusInput.current = fn;
  }, []);

  useEffect(() => {
    setErrorMessege('');

    todoService
      .getTodos()
      .then(loadingTodos => {
        setTodos(loadingTodos);

        focusInput.current?.();
      })
      .catch(() => {
        setErrorMessege(MessageError.loading);
      });
  }, []);

  const visibleTodos = todos.filter(todo => {
    return (
      statusFilter === StatusFilter.All ||
      (statusFilter === StatusFilter.Active && !todo.completed) ||
      (statusFilter === StatusFilter.Completed && todo.completed)
    );
  });

  function addTodos({
    title,
    completed,
    userId,
  }: Omit<Todo, 'id'>): Promise<void> {
    setErrorMessege('');

    const newTemptodo: Todo = {
      id: -1,
      title,
      completed,
      userId,
    };

    setTempTodo(newTemptodo);

    return todoService
      .creatTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);

        focusInput.current?.();
      })
      .catch(error => {
        setTempTodo(null);
        setErrorMessege(MessageError.add);

        throw error;
      });
  }

  function deleteTodos(id: number) {
    setErrorMessege('');
    setDeletingIds(prev => new Set(prev).add(id));

    todoService
      .deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));

        focusInput.current?.();
      })
      .catch(error => {
        setErrorMessege(MessageError.delete);
        focusInput.current?.();

        throw error;
      })
      .finally(() => {
        setDeletingIds(prev => {
          const next = new Set(prev);

          next.delete(id);

          return next;
        });
      });
  }

  async function handleClearCompleted() {
    try {
      setErrorMessege('');

      const completedTodos = todos.filter(todo => todo.completed);

      setDeletingIds(prev => {
        const next = new Set(prev);

        completedTodos.forEach(t => next.add(t.id));

        return next;
      });

      const results = await Promise.allSettled(
        completedTodos.map(todo => todoService.deleteTodos(todo.id)),
      );

      const failedIds = results
        .map((result, i) =>
          result.status === 'rejected' ? completedTodos[i].id : null,
        )
        .filter(Boolean);

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !todo.completed || failedIds.includes(todo.id),
        ),
      );

      focusInput.current?.();

      if (failedIds.length) {
        setErrorMessege(MessageError.delete);
      } else {
        setErrorMessege('');
      }

      setDeletingIds(new Set());
    } catch (err) {
      setErrorMessege(MessageError.SomethingWentWrong);
      focusInput.current?.();
      setDeletingIds(new Set());
    }
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (errorMessege) {
      timer = setTimeout(() => {
        setErrorMessege('');
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [errorMessege]);

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader
            todos={todos}
            onSubmit={addTodos}
            setErrorMessege={setErrorMessege}
            focusInputFn={focusInputFn}
          />
          {todos && (
            <TodoMain
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodos}
              deletingIds={deletingIds}
            />
          )}
          {todos && (
            <TodoFooter
              setStatusFilter={setStatusFilter}
              handleClearCompleted={handleClearCompleted}
              todos={todos}
            />
          )}
        </div>
        <ErrorNotification messege={errorMessege} />
      </div>
    </>
  );
};
