import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { FilterOption } from './types/FilterOption';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [hideError, setHideError] = useState(true);
  const [filterOption, setFilterOption] = useState(FilterOption.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [focusTrigger, setFocusTrigger] = useState(0);

  const filteredTodos = () => {
    switch (filterOption) {
      case FilterOption.Active:
        return todos.filter(todo => !todo.completed);
      case FilterOption.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const showError = (error: ErrorMessage) => {
    setErrorMessage(error);
    setHideError(false);
    setTimeout(() => setHideError(true), 3000);
  };

  useEffect(() => {
    setHideError(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      });
  }, []);

  const handleAddNewTodo = (title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      showError(ErrorMessage.TitleEmpty);

      return Promise.reject();
    }

    setTempTodo({ title, id: 0, completed: false, userId: USER_ID });

    return postTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        showError(ErrorMessage.Add);
        setTempTodo(null);
        throw new Error();
      });
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(curr => curr.filter(todo => todo.id !== id));
        setFocusTrigger(prev => prev + 1);
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
      });
  };

  const handleDeleteCompletedTodos = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...completedIds]);
    const promises = completedIds.map(id => {
      return deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));

          return true;
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          setProcessingIds(prev => prev.filter(procId => procId !== id));
        });
    });

    Promise.all(promises).then(results => {
      if (results.includes(false)) {
        showError(ErrorMessage.Delete);
      }

      setFocusTrigger(prev => prev + 1);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          activeTodosCount={activeTodosCount}
          onAddNewTodo={handleAddNewTodo}
          focusTrigger={focusTrigger}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos()}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            processingIds={processingIds}
          />
        )}
        {(todos.length > 0 || tempTodo) && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            selectedFilter={filterOption}
            onFilterChange={setFilterOption}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: hideError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHideError(true)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
