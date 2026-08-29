/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoMain } from './components/TodoMain/TodoMain';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { filterTypes } from './utils/filterTypes';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  LoadError = 'Unable to load todos',
  TitleError = 'Title should not be empty',
  AddError = 'Unable to add a todo',
  DeleteError = 'Unable to delete a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [query, setQuery] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadError);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  useEffect(() => {
    if (!isInputDisabled) {
      textInputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const filteredTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.Active && todo.completed) {
      return false;
    }

    if (filterStatus === FilterStatus.Completed && !todo.completed) {
      return false;
    }

    return true;
  });

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TitleError);
      setTimeout(() => setErrorMessage(null), 3000);

      return;
    }

    setIsInputDisabled(true);

    const tempTodoItem: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tempTodoItem);

    createTodo({ title: trimmedTitle, userId: USER_ID })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTempTodo(null);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddError);
        setTimeout(() => setErrorMessage(null), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsInputDisabled(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleAddTodo(query);
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsInputDisabled(true);
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, todoToDelete.id]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteError);
        setTimeout(() => setErrorMessage(null), 3000);
      })
      .finally(() => {
        setLoadingTodoIds([]);
        setIsInputDisabled(false);
      });
  };

  const handleClearCompleted = () => {
    setIsInputDisabled(true);

    const completed = todos.filter(todo => todo.completed);
    const completedIds = completed.map(t => t.id);

    setLoadingTodoIds(completedIds);

    Promise.allSettled(
      completed.map(todo => deleteTodo(todo.id).then(() => todo.id)),
    )
      .then(results => {
        const successfulIds: number[] = [];
        let hasError = false;

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfulIds.push(result.value);
          } else {
            hasError = true;
          }
        });

        setTodos(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (hasError) {
          setErrorMessage(ErrorMessage.DeleteError);
          setTimeout(() => setErrorMessage(null), 3000);
        }
      })
      .finally(() => {
        setLoadingTodoIds([]);
        setIsInputDisabled(false);
      });
  };

  const activeTodos = () => {
    const active = todos.filter(todo => !todo.completed);

    return active.length;
  };

  const completedTodos = () => {
    const completed = todos.filter(todo => todo.completed);

    return completed.length;
  };

  const handleFilterChange = (type: string) => {
    if (type === FilterStatus.All) {
      setFilterStatus(FilterStatus.All);
    }

    if (type === FilterStatus.Active) {
      setFilterStatus(FilterStatus.Active);
    }

    if (type === FilterStatus.Completed) {
      setFilterStatus(FilterStatus.Completed);
    }
  };

  const handleHideBtn = () => {
    setErrorMessage(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={
              todos.every(todo => todo.completed)
                ? 'todoapp__toggle-all active'
                : 'todoapp__toggle-all'
            }
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={textInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isInputDisabled}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
              }}
              autoFocus
            />
          </form>
        </header>

        <TodoMain
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            active={activeTodos}
            completed={completedTodos}
            status={filterStatus}
            onFilterChange={handleFilterChange}
            filterTypes={filterTypes}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification onHide={handleHideBtn} errorMessage={errorMessage} />
    </div>
  );
};
