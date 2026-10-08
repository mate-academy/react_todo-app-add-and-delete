/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const focusNewTodoField = () => {
    setTimeout(() => {
      newTodoField.current?.focus();
    }, 0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    setErrorMessage('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      focusNewTodoField();

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsAdding(true);

    createTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        focusNewTodoField();
      });
  };

  const handleDelete = (todoId: number) => {
    if (deletingTodoIds.includes(todoId)) {
      return;
    }

    setErrorMessage('');
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        focusNewTodoField();
      });
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const hasTodos = todos.length > 0;
  const allCompleted = hasTodos && activeTodosCount === 0;

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          isAdding={isAdding}
          hasTodos={hasTodos}
          allCompleted={allCompleted}
          inputRef={newTodoField}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          onDelete={handleDelete}
        />

        {hasTodos && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={completedTodos.length > 0}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onHide={() => setErrorMessage('')}
      />
    </div>
  );
};
