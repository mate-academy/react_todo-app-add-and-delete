/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { createTodos, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [triggerFocus, setTriggerFocus] = useState(0);

  const handleFindError = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDeleteCompleteAll = () => {
    const filteredCompleted = todos.filter(
      element => element.completed === true,
    );

    const filteredCompletedIds = filteredCompleted.map(e => e.id);

    setProcessingIds(prev => [...prev, ...filteredCompletedIds]);

    const promises: Promise<boolean>[] = filteredCompletedIds.map(id => {
      return deleteTodo(id)
        .then(() => {
          setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));

          return true;
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          setProcessingIds(prev => prev.filter(currentId => currentId !== id));
        });
    });

    Promise.all(promises).then(results => {
      if (results.some(element => element === false)) {
        handleFindError('Unable to delete a todo');
      }

      setTriggerFocus(prev => prev + 1);
    });
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
        setTriggerFocus(prev => prev + 1);
      })
      .catch(() => {
        handleFindError('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
      });
  };

  const handleCreateTodo = (title: string): Promise<void> => {
    const trimTitle = title.trim();

    if (trimTitle.length === 0) {
      handleFindError('Title should not be empty');

      return Promise.reject();
    }

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimTitle,
      completed: false,
    };

    setTempTodo(todo);

    return createTodos(trimTitle)
      .then(newTodo => {
        setTodos(currentTodo => {
          return [...currentTodo, newTodo];
        });
      })
      .catch(() => {
        handleFindError('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

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

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

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
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompleteAll={handleDeleteCompleteAll}
            completedTodos={completedTodos}
          />
        )}
        {/* Hide the footer if there are no todos */}
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
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
