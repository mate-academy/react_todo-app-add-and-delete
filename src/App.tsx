/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoContext } from './TodoContext';
import { TodoList } from './TodoList';
import { TodoItem } from './TodoItem';

const USER_ID = 22;

enum ErrorMessage {
  'add',
  'update',
  'delete',
  'title',
}

enum FilterOption {
  'Active',
  'Completed',
  'All',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [count, setCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(FilterOption.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [isDeliting, setIsDeliting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  const [clear, setClear] = useState(false);

  let errorTimerId: NodeJS.Timeout;

  const inputFocus = useRef<HTMLInputElement>(null);

  const todoCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    if (!titleValue.length && inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [titleValue]);

  const errorHandler = (errorPlace: ErrorMessage) => {
    clearTimeout(errorTimerId);

    switch (errorPlace) {
      case ErrorMessage.title:
        setErrorMessage('Title should not be empty');
        break;
      case ErrorMessage.add:
        setErrorMessage('Unable to add a todo');
        break;
      case ErrorMessage.update:
        setErrorMessage('Unable to update a todo');
        break;
      case ErrorMessage.delete:
        setErrorMessage('Unable to delete a todo');
        break;
      default:
        break;
    }

    errorTimerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(data => {
        setTodos(data);
        setCount(data.length);
      })
      .catch(e => {
        errorHandler(ErrorMessage.add);
        throw e;
      });
    // eslint-disable-next-line
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
  };

  const filteredTodos = todos.filter(todo => {
    if (selectedFilter === FilterOption.Completed) {
      return todo.completed;
    }

    if (selectedFilter === FilterOption.Active) {
      return !todo.completed;
    }

    return true;
  });

  const handleErrorButton = () => {
    errorHandler(ErrorMessage.title);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = titleValue.trim();

    if (!trimedTitle.length) {
      errorHandler(ErrorMessage.title);
      setTitleValue('');
    }

    const addTodo = ({ userId, title, completed }: Todo) => {
      setIsSubmiting(true);
      setTempTodo({
        id: 0,
        userId,
        title,
        completed,
      });

      if (tempTodo) {
        setSelectedTodoId(tempTodo?.id);
      }

      todoService.addTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos([...todos, newTodo]);
          setCount(count + 1);
        })
        .catch(() => {
          errorHandler(ErrorMessage.add);
        })
        .finally(() => {
          setTempTodo(null);
          setIsSubmiting(false);
        });
    };

    if (trimedTitle.length) {
      const id = (+new Date());

      const newTodo: Todo = {
        id,
        title: titleValue,
        completed: false,
        userId: USER_ID,
      };

      addTodo(newTodo);

      setTitleValue('');
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    if (areAllCompleted) {
      setCount(todos.length);
    } else {
      setCount(0);
    }

    setTodos(updatedTodos);
  };

  const deleteTodo = (deleteId: number) => {
    setIsDeliting(true);
    setSelectedTodoId(deleteId);

    return todoService.deleteTodo(deleteId)
      .then(() => {
        const todoForDeletion = todos.filter(todo => todo.id === deleteId);

        if (todoForDeletion[0].completed) {
          setTodos(todos.filter(todo => todo.id !== deleteId));
        } else {
          setCount(count - 1);

          setTodos(todos.filter(todo => todo.id !== deleteId));
        }
      })
      .catch(() => {
        setTodos(todos);
        setCount(count);
        errorHandler(ErrorMessage.delete);
      })
      .finally(() => {
        setIsDeliting(false);
        setSelectedTodoId(0);
      });
  };

  const handleClear = () => {
    const deletingTodos = todos;

    setClear(true);

    deletingTodos.filter(todo => {
      if (todo.completed) {
        todoService.deleteTodo(todo.id)
          .then(() => {
            setTodos(todos.filter(tod => !tod.completed));
          })
          .catch(() => {
            setTodos(todos);
            errorHandler(ErrorMessage.delete);
          })
          .finally(() => {
            setClear(false);
          });
      }

      return true;
    });
  };

  const checkForCompleted = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const value = {
    filteredTodo: filteredTodos,
    deleteTodo,
    setCount,
    count,
    setTodos,
    todos,
    isSubmitting,
    setIsSubmiting,
    isDeliting,
    setIsDeliting,
    setSelectedTodo: setSelectedTodoId,
    selectedTodo: selectedTodoId,
    clear,
  };

  return (
    <div className="todoapp">
      <TodoContext.Provider value={value}>
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this buttons is active only if there are some active todos */}
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />

            <form onSubmit={handleSubmit}>
              <input
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={titleValue}
                ref={inputFocus}
                onChange={handleInput}
                disabled={isSubmitting}
              // eslint-disable-next-line
              />
            </form>
          </header>

          <TodoList />
          {tempTodo && <TodoItem todo={tempTodo} />}

          {/* Hide the footer if there are no todos */}
          {todos.length > 0 && (
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todoCount === 1 ? `${todoCount} item left`
                  : `${todoCount} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedFilter === FilterOption.All,
                  })}
                  onClick={() => {
                    setSelectedFilter(FilterOption.All);
                  }}
                  data-cy="FilterLinkAll"
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedFilter === FilterOption.Active,
                  })}
                  onClick={() => {
                    setSelectedFilter(FilterOption.Active);
                  }}
                  data-cy="FilterLinkActive"
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedFilter === FilterOption.Completed,
                  })}
                  onClick={() => {
                    setSelectedFilter(FilterOption.Completed);
                  }}
                  data-cy="FilterLinkCompleted"
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClear}
                disabled={checkForCompleted <= 0}
              >
                Clear completed
              </button>
            </footer>
          )}
        </div>

        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: !errorMessage.length,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={handleErrorButton}
          />
          {errorMessage}
        </div>
      </TodoContext.Provider>
    </div>
  );
};
