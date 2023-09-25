/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback, useRef,
} from 'react';
import classNames from 'classnames';
import {
  getTodos, deleteTodo, addTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';

function filterTodos(todos: Todo[], filterField: FilterType) {
  let filteredTodos = todos;

  if (filterField !== FilterType.All) {
    switch (filterField) {
      case FilterType.Completed: {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      }

      case FilterType.Active: {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      }

      default:
        throw new Error('Unable to filter todos');
    }
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterField, setFilterField] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');

  const activeTodosCounter = todos.filter(
    todo => todo.completed !== true,
  ).length;

  const completedTodosCounter = todos.filter(
    todo => todo.completed === true,
  ).length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterField);
  }, [todos, filterField]);

  const handleDeleteTodo = useCallback((todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos((prevState) => (
          prevState.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  }, []);

  const handleAddTodo = useCallback((newTodoTitle: string) => {
    return addTodo(newTodoTitle.trim())
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      });
  }, []);

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      });
  };

  const handleClearCompleted = () => {
    const compeletedTodos = todos.filter(todo => todo.completed === true);

    compeletedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    handleAddTodo(todoTitle)
      .then(() => {
        setTodoTitle('');
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          todoTitle={todoTitle}
          onTodoTitleChange={setTodoTitle}
          onFormSubmit={handleSubmit}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDeleteTodo={handleDeleteTodo}
              onTodoUpdate={
                (newTodoTitle) => handleUpdateTodo(todo, newTodoTitle)
              }
            />
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCounter} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterField === FilterType.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterField(FilterType.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterField === FilterType.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterField(FilterType.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterField === FilterType.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterField(FilterType.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedTodosCounter}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
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
