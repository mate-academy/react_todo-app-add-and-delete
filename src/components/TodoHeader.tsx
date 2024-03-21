/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodosContext } from './Todos-Context';
import { USER_ID, addTodos } from '../api/todos';

export const TodoHeader: React.FC = () => {
  const {
    query,
    setQuery,
    setErrorMessage,
    todos,
    setTodos,
    handleCompleteAll,
    loading,
    setTempTodo,
    titleField,
    tempTodo,
    deletingTodos,
  } = useContext(TodosContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    event.preventDefault();
  };

  useEffect(() => {
    if (titleField?.current) {
      titleField.current.focus();
    }
  }, [query, titleField, tempTodo, deletingTodos]);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
    } else {
      setIsSubmitting(true);
      setIsDisabled(true);

      const newTodoData = {
        id: 0,
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      setTempTodo(newTodoData);
      addTodos(newTodoData)
        .then(response => {
          setTodos([...todos, response]);
          setQuery('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          titleField?.current?.focus();
        })
        .finally(() => {
          setTempTodo(null);
          setIsSubmitting(false);
          setIsDisabled(false);
          titleField?.current?.focus();
        });
    }
  };

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
          disabled={isDisabled}
        />
        {isSubmitting && (
          <div data-cy="TodoLoader" className="modal overlay">
            <div
              className={classNames(
                'modal-background has-background-white-ter',
                {
                  'is-active': loading,
                },
              )}
            />
            <div className="loader" />
          </div>
        )}
      </form>
    </header>
  );
};
