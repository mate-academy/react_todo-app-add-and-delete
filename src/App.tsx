/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import * as todoApi from './api/todos';
import { Todo } from './types/Todo';
import { StatusFilter, ErrorMessage } from './types/enums';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.All);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const loadTodos = () => {
    setErrorMessage(ErrorMessage.None);
    todoApi
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => setErrorMessage(ErrorMessage.Load));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === StatusFilter.Active) {
        return !todo.completed;
      }

      if (filter === StatusFilter.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  const activeCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = inputValue.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsInputDisabled(true);
    setErrorMessage(ErrorMessage.None);

    todoApi
      .addTodo({
        userId: todoApi.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
      });
  };

  const handleDeletion = (id: number) => {
    setDeletingIds(prev => [...prev, id]);

    return todoApi
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(item => item.id !== id));
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.Delete);
        throw error;
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingIds(prev => [...prev, ...completedIds]);

    const deletionPromises = completedIds.map(id =>
      todoApi
        .deleteTodo(id)
        .then(() => id)
        .catch(() => {
          setErrorMessage(ErrorMessage.Delete);

          return null;
        }),
    );

    Promise.all(deletionPromises).then(results => {
      const successfulIds = results.filter((id): id is number => id !== null);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
      setDeletingIds(prev => prev.filter(id => !completedIds.includes(id)));
    });
  };

  const handleUpdate = (item: Todo) => {
    return todoApi
      .updateTodo(item)
      .then(() => {
        setTodos((currentTodos: Todo[]) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === item.id);

          newTodos.splice(index, 1, item);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      });
  };

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSubmit={event => {
            setTempTodo({
              id: 0,
              userId: todoApi.USER_ID,
              title: inputValue.trim(),
              completed: false,
            });
            handleFormSubmit(event);
          }}
          todosCount={todos.length}
          isInputDisabled={isInputDisabled}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeletion}
            deletingIds={deletingIds}
            onUpdate={handleUpdate}
          />
        )}

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
