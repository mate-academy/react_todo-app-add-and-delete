/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  useRef,
} from 'react';
import classNames from 'classnames';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoStatus, Todo } from './types';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { getFilteredTodos } from './utils/getFilteredTodos';
import {
  USER_ID,
  DOWNLOAD_ERROR,
  TITLE_ERROR,
  POST_ERROR,
} from './utils/constants';
import { TodoContext } from './TodoContext';

export const App: React.FC = () => {
  const [filterByStatus, setFilterByStatus] = useState(TodoStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const {
    todoItems,
    setTodoItems,
    setTempTodo,
    isLoading,
    setIsLoading,
    setErrorMessage,
    uncompletedTodosLength,
  } = useContext(TodoContext);

  const inputLine = useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => getFilteredTodos(
    filterByStatus, todoItems,
  ), [filterByStatus, todoItems]);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    try {
      const createdTodo = await todoService.createTodo(newTodo);

      setNewTodoTitle('');
      setTodoItems((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorMessage(POST_ERROR);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(TITLE_ERROR);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo);
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodoItems)
      .catch(() => {
        setErrorMessage(DOWNLOAD_ERROR);
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputLine.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button is active only if there are some active todos */}
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all', {
                active: uncompletedTodosLength,
              },
            )}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={onFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={onTitleChange}
              disabled={isLoading}
              ref={inputLine}
            />
          </form>
        </header>

        {!!visibleTodos.length && (
          <TodoList
            todos={visibleTodos}
          />
        )}
        {/* <section className="todoapp__main"> */}
        {/* This todo is being edited */}
        {/* <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div
          data-cy="TodoLoader"
          className="modal overlay"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section> */}

        {/* Hide the footer if there are no todos */}
        {!!todoItems.length && (
          <TodoFilter
            selectStatus={setFilterByStatus}
            status={filterByStatus}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification />
    </div>
  );
};
