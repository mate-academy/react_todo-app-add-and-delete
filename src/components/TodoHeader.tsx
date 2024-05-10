import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';
import { USER_ID } from '../api/todos';
import { useTodosContext } from '../TodoContext';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
};

export const TodoHeader: React.FC<Props> = ({ todos }) => {
  const {
    titleField,
    handleError,
    setTodos,
    setTitleField,
    setTempTodo,
    setLoadingItemsIds,
  } = useTodosContext();

  const [isDisabled, setIsDisabled] = useState(false);
  const normalizedTitleField = titleField.trim();

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    const tempTodoId = 0;

    setTempTodo(Object.assign(newTodo, { id: tempTodoId }));
    setLoadingItemsIds(prevIds => [...prevIds, tempTodoId]);

    setIsDisabled(true);

    createTodo(newTodo)
      .then(res => {
        setTodos([...todos, res]);
        setTitleField('');
        setLoadingItemsIds(prevIds => prevIds.filter(id => id !== tempTodoId));
      })
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedTitleField.length) {
      handleError('Title should not be empty');

      return;
    }

    addTodo({
      userId: USER_ID,
      title: normalizedTitleField,
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={event => handleAddTodo(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitleField(event.target.value)}
          value={titleField}
          disabled={isDisabled}
          ref={input => input && input.focus()}
        />
      </form>
    </header>
  );
};
