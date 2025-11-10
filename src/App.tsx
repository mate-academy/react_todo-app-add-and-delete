/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { StatusFilter } from './types/StatusFilter';
import { ErrorMessages } from './types/ErrorMessages';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<StatusFilter>(StatusFilter.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    getTodos()
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadFail);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case StatusFilter.Active:
          return !todo.completed;

        case StatusFilter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  const completedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const countActive = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

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

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();

    if (newTodoTitle.trim() === '') {
      setErrorMessage(ErrorMessages.TitleEmpty);

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    const tempToDo = {
      id: 0,
      title: newTodoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tempToDo);

    createTodo(tempToDo.title)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.AddFail);
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
      });
  }

  function handleDeleteTodo(id: number) {
    setErrorMessage('');

    setDeletingTodoIds(currentIds => [...currentIds, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteFail);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(toId => toId !== id),
        );
      });
  }

  function handleClearCompleted() {
    setErrorMessage('');
    const finishedTodos = todos.filter(t => t.completed);

    const idOfFinishedTodos = finishedTodos.map(t => t.id);

    setDeletingTodoIds(currents => [...currents, ...idOfFinishedTodos]);
    const deletePromises = finishedTodos.map(t => deleteTodo(t.id));

    Promise.allSettled(deletePromises)
      .then(results => {
        const hasFailed = results.some(r => r.status === 'rejected');

        if (hasFailed) {
          setErrorMessage(ErrorMessages.DeleteFail);
        }

        const successfulIds = finishedTodos
          .filter((_todo, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => !idOfFinishedTodos.includes(id)),
        );
      });
  }

  const isAppBusy = isAdding || deletingTodoIds.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          onNewTodoChange={setNewTodoTitle}
          isAppBusy={isAppBusy}
          onTodoAdd={handleAddTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={handleDeleteTodo}
              deletingTodoIds={deletingTodoIds}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isDeleting={true}
                onDelete={handleDeleteTodo}
              />
            )}

            <Footer
              activeTodosCount={countActive}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
              onClearCompleted={handleClearCompleted}
              completedTodos={completedTodos}
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
