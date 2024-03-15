/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { TodoErrors } from './TodoErrors';
import { TodosContext } from './Todos.Context';

export const TodoApp: React.FC = () => {
  const {
    addTodo,
    todos,
    setTodos,
    setError,
    submitting,
    setNewTodo,
    newTodo,
    setTempTodo,
  } = useContext(TodosContext);
  const [toggleAll, setToggleAll] = useState(false);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      addTodo({
        id: +new Date(),
        userId: 206,
        title: newTodo.trim(),
        completed: false,
      });
      setTempTodo({
        id: 0,
        title: newTodo.trim(),
        userId: 206,
        completed: false,
      });

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearNewTodo();
      }, 3000);
    } else {
      setError('Title should not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const clearNewTodo = () => {
    setNewTodo('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) {
      handleAddTodo();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && newTodo.length !== 0) {
      handleAddTodo();
    }

    if (event.key === 'Enter' && newTodo.length === 0) {
      setError('Title should not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !toggleAll,
    }));

    setTodos(updatedTodos);
    setToggleAll(!toggleAll);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: toggleAll,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={submitting}
              id="todoInput"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>
        {!!todos.length && (
          <>
            <TodoList />
            <TodoFilter />
          </>
        )}
      </div>

      <TodoErrors />
    </div>
  );
};
