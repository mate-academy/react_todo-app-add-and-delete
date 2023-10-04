/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { Filter } from '../types/Filter';
import { TodosFilter } from '../components/TodosFilter/TodosFilter';
import { TodosList } from '../components/TodosList/TodosList';
import { TodosContext } from '../TodosContext';
import { USER_ID } from '../utils/userId';
import { addTodos, deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export const TodoApp: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    errorDiv,
    tempTodo,
    setTempTodo,
  } = useContext(TodosContext);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState(Filter.ALL);

  const noCompleteTodos = todos.filter(elem => !elem.completed);
  const completeTodos = todos.filter(elem => elem.completed);
  const isSomeComplete = todos.some(todo => todo.completed === true);
  const allCompleted = todos.every(todo => todo.completed === true);

  const inputTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputTitle.current !== null) {
      inputTitle.current.focus();
    }
  }, []);

  const handlerFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handlerChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handlerAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim() !== '') {
      const newTask = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      if (inputTitle.current !== null) {
        inputTitle.current.disabled = true;
      }

      addTodos(newTask)
        .then(newTodo => {
          setTempTodo({
            ...newTask,
            id: 0,
          });
          setTimeout(() => {
            setTitle('');
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setTempTodo(null);
          }, 300);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          if (errorDiv.current !== null) {
            errorDiv.current.classList.remove('hidden');
            setTimeout(() => {
              if (errorDiv.current !== null) {
                errorDiv.current.classList.add('hidden');
                setErrorMessage('');
              }
            }, 3000);
          }
        })
        .finally(() => {
          if (inputTitle.current !== null) {
            inputTitle.current.disabled = false;
            inputTitle.current.focus();
          }
        });
    } else {
      setErrorMessage('Title should not be empty');
      if (errorDiv.current !== null) {
        errorDiv.current.classList.remove('hidden');
        setTimeout(() => {
          if (errorDiv.current !== null) {
            errorDiv.current.classList.add('hidden');
            setErrorMessage('');
          }
        }, 3000);
      }
    }
  };

  const handlerClearCompletes = () => {
    completeTodos.forEach((eachTodo) => {
      deleteTodo(eachTodo.id)
        .then(() => {
          setTodos((currentTodos: Todo[]) => currentTodos
            .filter(elem => elem.id !== eachTodo.id));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          if (errorDiv.current !== null) {
            errorDiv.current.classList.remove('hidden');
            setTimeout(() => {
              if (errorDiv.current !== null) {
                errorDiv.current.classList.add('hidden');
                setErrorMessage('');
              }
            }, 3000);
          }
        });
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === Filter.ALL) {
      return true;
    }

    if (filter === Filter.ACTIVE) {
      return !todo.completed;
    }

    return todo.completed;
  });

  const handlerCloseError = () => {
    if (errorDiv.current !== null) {
      errorDiv.current.classList.add('hidden');
      setErrorMessage('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handlerAddTodo}>
            <input
              ref={inputTitle}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handlerChangeTitle}
            />
          </form>
        </header>

        {(todos.length !== 0 || tempTodo !== null) && (
          <TodosList todos={filteredTodos} />
        )}

        {(todos.length !== 0 || tempTodo !== null) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${noCompleteTodos.length} items left`}
            </span>

            <TodosFilter
              currentFilter={filter}
              onFilterChange={handlerFilterChange}
            />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!isSomeComplete}
              onClick={handlerClearCompletes}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        ref={errorDiv}
        data-cy="ErrorNotification"
        className="hidden notification
          is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handlerCloseError}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Unable to add a todo
        <br />
        Unable to update a todo */}
      </div>

    </div>

  );
};
