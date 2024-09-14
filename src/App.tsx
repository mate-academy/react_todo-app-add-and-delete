/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import classNames from 'classnames';
import { client } from './utils/fetchClient';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [changindIds, setChangingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const showErrorMes = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (newTodoTitle.trim().length === 0) {
      showErrorMes('Title should not be empty');
    } else {
      const newTodo = {
        title: newTodoTitle.trim(),
        completed: false,
        userId: todoServices.USER_ID,
      };

      setIsLoading(true);
      const tempId = Math.random();

      setTempTodo({
        ...newTodo,
        id: tempId,
      });

      setChangingIds(prev => [...prev, tempId]);

      client
        .post<Todo>('/todos', newTodo)
        .then(res => {
          setTempTodo(null);
          setTodos(prev => [...prev, res]);
          setNewTodoTitle('');
        })
        .catch(() => {
          showErrorMes('Unable to add a todo');
          setTempTodo(null);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  useEffect(() => {
    todoServices
      .getTodos()
      .then(res => {
        if (res.length === 0) {
          showErrorMes('Unable to load todos');
        } else {
          setTodos(res);
        }
      })
      .catch(() => showErrorMes('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, todos]);

  const filteredTodos = useMemo(() => {
    return todoServices.filtering(todos, filter);
  }, [todos, filter]);

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteItem = (itemId: number) => {
    setChangingIds(prev => [...prev, itemId]);
    client
      .delete(`/todos/${itemId}`)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== itemId));
      })
      .catch(() => {
        showErrorMes('Unable to delete a todo');
      })
      .finally(() => setChangingIds(prev => prev.filter(id => id !== itemId)));
  };

  const handleClearComleted = () => {
    const deletingId: number[] = [];

    todos.forEach(todo => (todo.completed ? deletingId.push(todo.id) : null));

    deletingId.forEach(id => handleDeleteItem(id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              ref={inputRef}
              onChange={handleChange}
              disabled={isLoading}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            changindIds={changindIds}
            onDeleteItem={handleDeleteItem}
            tempTodo={tempTodo}
            onUpdate={() => {}}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onClick={setFilter}
            onClearCompleted={handleClearComleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage.length },
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
