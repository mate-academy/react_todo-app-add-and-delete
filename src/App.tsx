/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const newTodoField = useRef<HTMLInputElement>(null);
  const todosWithTemp = tempTodo ? [...todos, tempTodo] : todos;

  useEffect(() => {
    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
        setErrorMessage(Errors.NONE);
      })
      .catch(() => {
        setErrorMessage(Errors.LOADING_ERROR);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage(Errors.NONE);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!loading && !isCreating && deletingTodoIds.length === 0) {
      newTodoField.current?.focus();
    }
  }, [loading, isCreating, deletingTodoIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todosWithTemp.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.EMPTY_TITLE);

      return;
    }

    setErrorMessage(Errors.NONE);
    setIsCreating(true);

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: Math.random(),
    });

    addTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.ADDING_ERROR);
      })
      .finally(() => {
        setTempTodo(null);
        setIsCreating(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage(Errors.NONE);

    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.DELETING_ERROR);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage(Errors.NONE);

    setDeletingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodos.map(todo => todo.id),
    ]);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage(Errors.DELETING_ERROR);
        })
        .finally(() => {
          setDeletingTodoIds(currentIds =>
            currentIds.filter(id => id !== todo.id),
          );
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          title={title}
          newTodoField={newTodoField}
          loading={loading}
          isCreating={isCreating}
          onTitleChange={setTitle}
          onAdd={handleSubmit}
        />

        {todosWithTemp.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDelete}
            deletingTodoIds={deletingTodoIds}
            tempTodoId={tempTodo?.id ?? null}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClear={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={setErrorMessage}
      />
    </div>
  );
};
