/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { FilterStatus } from './types/FilterStatus';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [triggerFocus, setTriggerFocus] = useState(0);

  const handleShowError = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
        setTriggerFocus(prev => prev + 1);
      })
      .catch(() => {
        handleShowError('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
      });
  };

  const handleDeleteCompletedTodos = () => {
    const completedTodosIds = todos.filter(todo => todo.completed);
    const completedTodosList = completedTodosIds.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...completedTodosList]);
    const promises: Promise<boolean>[] = completedTodosList.map(completedId => {
      return deleteTodo(completedId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== completedId),
          );

          return true;
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          setProcessingIds(prev =>
            prev.filter(currentId => currentId !== completedId),
          );
        });
    });

    Promise.all(promises).then(result => {
      if (result.some(el => el === false)) {
        handleShowError('Unable to delete a todo');
      }

      setTriggerFocus(prev => prev + 1);
    });
  };

  const handleCreateTodo = (title: string): Promise<void> => {
    const titleTrimmed = title.trim();

    if (titleTrimmed.length === 0) {
      handleShowError('Title should not be empty');

      return Promise.reject();
    }

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: titleTrimmed,
      completed: false,
    };

    setTempTodo(todo);

    //pass on the server
    return addTodo(titleTrimmed)
      .then((newTodo: Todo) => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
      })
      .catch(() => {
        handleShowError('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onCreateTodo={handleCreateTodo} triggerFocus={triggerFocus} />
        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            onDelete={handleDeleteTodo}
            processingIds={processingIds}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            isLoading={true}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodo={handleDeleteCompletedTodos}
            completedTodos={completedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
