/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { TodosContext } from './Todos-Context';
import { USER_ID, addTodos } from '../api/todos';

export const TodoHeader: React.FC = () => {
  // eslint-disable-next-line max-len, prettier/prettier
  const {
    query,
    setQuery,
    setErrorMessage,
    todos,
    setTodos,
    handleCompleteAll,
  } = useContext(TodosContext);
  // const todoComplet = todos.some(todo => todo.completed);

  const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    event.preventDefault();
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
    } else {
      const newTodoData = {
        id: 0,
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      addTodos(newTodoData)
        .then(response => {
          setTodos([...todos, response]);
          setQuery('');
        })
        .catch(() => {
          setErrorMessage(`Unable to load todos`);
        });
    }
  };

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [titleField]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleCompleteAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handlerInput}
          value={query}
        />
      </form>
    </header>
  );
};
