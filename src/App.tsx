import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { SelectFilter } from './utils/SelectFilter';
import { Todo } from './types/Todo';
import { ErrorMessage } from './utils/ErrorMessages';
import * as ApiServices from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoRow } from './components/TodoRow';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterOption, setFilterOption] = useState(SelectFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const isEveryCompleted = useMemo(() => todos.every(todo => todo.completed),
    [todos]);
  const isAnyCompleted = useMemo(() => todos.some(todo => todo.completed),
    [todos]);
  const activeTodosCounter = useMemo(() => {
    const activeTodos = todos.filter(todo => !todo.completed).length;

    return activeTodos;
  }, [todos]);
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterOption) {
        case SelectFilter.Active: return !todo.completed;
        case SelectFilter.Completed: return todo.completed;
        case SelectFilter.All:
        default: return true;
      }
    });
  }, [todos, filterOption]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    ApiServices.getTodos()
      .then(setTodos)
      .catch((error: Error) => {
        setErrorMessage(ErrorMessage.UnableLoad);
        // eslint-disable-next-line no-console
        console.log(error.message);
      });
  }, []);

  const handleTodoAdd = (newTodoTitle: string) => {
    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return null;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: 0,
      completed: false,
    });

    const response = ApiServices
      .addTodo(newTodoTitle.trim())
      .then((newTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      }).catch(error => {
        setErrorMessage(ErrorMessage.UnableAdd);
        throw error;
      }).finally(() => {
        setTempTodo(null);
      });

    return response;
  };

  const handleTodoDelete = (todoId: number) => {
    setProcessingTodoIds(prevState => [...prevState, todoId]);

    return ApiServices
      .deleteTodo(todoId)
      .then(() => {
        setErrorMessage('');
        setTodos((prevTodos: Todo[]) => (
          prevTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableDelete);
      })
      .finally(() => {
        setProcessingTodoIds(prevState => (
          prevState.filter(id => id !== todoId)
        ));
      });
  };

  const handleTodoRename = (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    ApiServices
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map((currentTodo: Todo) => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UnableUpdate);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prevState => (
          prevState.filter(id => id !== todo.id)
        ));
      });
  };

  const handleTodoToggle = (todo: Todo) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    ApiServices
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map((currentTodo: Todo) => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UnableUpdate);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prevState => (
          prevState.filter(id => id !== todo.id)
        ));
      });
  };

  const handleClearCompletedTodos = () => {
    todos
      .forEach(todo => todo.completed && handleTodoDelete(todo.id));
  };

  const handleToggleAll = () => {
    if (isEveryCompleted) {
      return todos.forEach(handleTodoToggle);
    }

    return todos
      .forEach(todo => !todo.completed && handleTodoToggle(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTodoAdd={handleTodoAdd}
          isToggleActive={isEveryCompleted}
          isAnyTodos={Boolean(todos.length)}
          onToggleAllClick={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onTodoDelete={() => handleTodoDelete(todo.id)}
              onTodoRename={(todoTitle: string) => (
                handleTodoRename(todo, todoTitle)
              )}
              onTodoToggle={() => handleTodoToggle(todo)}
              isProcessing={processingTodoIds.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoRow
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCounter} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn(
                  'filter__link',
                  { selected: filterOption === SelectFilter.All },
                )}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilterOption(SelectFilter.All);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn(
                  'filter__link',
                  { selected: filterOption === SelectFilter.Active },
                )}
                data-cy="FilterLinkActive"
                onClick={() => setFilterOption(SelectFilter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn(
                  'filter__link',
                  { selected: filterOption === SelectFilter.Completed },
                )}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterOption(SelectFilter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompletedTodos}
              disabled={!isAnyCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          aria-label="delete"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
