/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo,
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { getFilteredTodos } from './api/helpers/getFiltereTodos';

export const App: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState(FilterTypes.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      showErrorMessage('');
    }, 3000);
  };

  const handleFilterOptionClick = (newOption: FilterTypes) => {
    if (selectedFilterType !== newOption) {
      setSelectedFilterType(newOption);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle) {
      showErrorMessage("Title can't be empty");

      return;
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      addTodo(newTodo)
        .then(uploadedTodo => setTodos(prev => ([
          ...prev,
          uploadedTodo,
        ])))
        .catch(() => showErrorMessage('Unable to add a todo`'))
        .finally(() => {
          setTempTodo(null);
          setNewTodoTitle('');
        });
    }
  };

  const handleDeleteTodo = useCallback((id: number) => {
    setDeletingTodosIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => (
          todo.id !== id
        )));
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodosIds(prev => {
          return prev.filter(deletingId => deletingId !== id);
        });
      });
  }, []);

  const handleClearCompletedClick = () => {
    const completedTodosIds = todos.reduce((ids: number[], todo) => {
      return todo.completed
        ? [...ids, todo.id]
        : ids;
    }, []);

    setDeletingTodosIds(prev => [...prev, ...completedTodosIds]);

    const deletePromises: Promise<unknown>[] = completedTodosIds.map(id => {
      return deleteTodo(id);
    });

    Promise.all(deletePromises).then(() => {
      setTodos(prev => prev.filter(({ id }) => {
        return !completedTodosIds.includes(id);
      }));
    });
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((loadedTodos) => {
          setTodos(loadedTodos);
        })
        .catch(() => {
          showErrorMessage('Can\'t load todos!');
        });
    }
  }, []);

  const visibleTodoos = useMemo(() => {
    return getFilteredTodos(todos, selectedFilterType);
  }, [todos, selectedFilterType]);

  const filterOptions = useMemo(() => Object.values(FilterTypes), []);

  const activeItemsNumber = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={!!tempTodo}
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {todos.length > 0 && (
                <TodoList
                  todos={visibleTodoos}
                  onDeleteTodo={handleDeleteTodo}
                  deletingTodosIds={deletingTodosIds}
                />
              )}

              {tempTodo && (
                <TodoItem todo={tempTodo} />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeItemsNumber} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                {filterOptions.map(option => (
                  <a
                    key={option}
                    data-cy="FilterLinkAll"
                    href="#/"
                    className={cn(
                      'filter__link',
                      { selected: selectedFilterType === option },
                    )}
                    onClick={() => handleFilterOptionClick(option)}
                  >
                    {option}
                  </a>
                ))}
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={activeItemsNumber === todos.length}
                onClick={handleClearCompletedClick}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseBtnClick={() => setErrorMessage('')}
      />
    </div>
  );
});
