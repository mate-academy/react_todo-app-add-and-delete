/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Todo } from './types/Todo';
import { getTodos, USER_ID } from './api/todos';
import { FILTERS } from './utils/constants';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { ErrorNotification } from './components/Erros';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(t => !t.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(t => t.completed);
  }, [todos]);
  const allCompleted = todos.length > 0 && activeTodosCount === 0;

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  function addTodo({ userId, title: todoTitle, completed }: Omit<Todo, 'id'>) {
    setErrorMessage('');

    setTempTodo({
      id: 0,
      userId,
      title: todoTitle,
      completed,
    });

    todoService
      .postTodos({ userId, title: todoTitle, completed })
      .then(newTodos => {
        setTodos(currentTodo => [...currentTodo, newTodos]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });
  }

  function deleteTodo(todoId: number) {
    setErrorMessage('');
    setProcessingTodoIds(currentIds => [...currentIds, todoId]);

    todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  }

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setErrorMessage('');

    const completedIds = completedTodos.map(todo => todo.id);

    setProcessingTodoIds(currentIds => [...currentIds, ...completedIds]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodos(todo.id)),
    );

    const successfullyDeletedIds: number[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfullyDeletedIds.push(completedTodos[index].id);
      }
    });

    if (successfullyDeletedIds.length < completedTodos.length) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    setProcessingTodoIds(currentIds =>
      currentIds.filter(id => !completedIds.includes(id)),
    );

    setTimeout(() => {
      newTodoFieldRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          allCompleted={allCompleted}
          handleSubmit={handleSubmit}
          newTodoFieldRef={newTodoFieldRef}
          title={title}
          setTitle={setTitle}
          isAdding={!!tempTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={deleteTodo}
              tempTodo={tempTodo}
              processingTodoIds={processingTodoIds}
            />

            <Footer
              activeTodosCount={activeTodosCount}
              filter={filter}
              onFilterChange={setFilter}
              hasCompletedTodos={hasCompletedTodos}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
