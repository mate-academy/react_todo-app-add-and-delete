import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  titleField: string;
  onTitleField: (newTitle: string) => void;
  onTodos: (newTodos: Todo[]) => void;
  onErrorMessage: (errMessage: string) => void;
  onTempTodo: (tempTodo: Todo | null) => void;
  onLoadingItemsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  titleField,
  onTitleField,
  onTodos,
  onErrorMessage,
  onTempTodo,
  onLoadingItemsIds,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const normalizedTitleField = titleField.trim();

  const handleErrorMessage = (errMessage: string) => {
    onErrorMessage(errMessage);
    setTimeout(() => onErrorMessage(''), 3000);
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    const tempId = 0;

    onTempTodo(Object.assign(newTodo, { id: tempId }));
    onLoadingItemsIds(prevIds => [...prevIds, tempId]);

    setIsDisabled(true);

    createTodo(newTodo)
      .then(res => {
        onTodos([...todos, res]);
        onTitleField('');
        onLoadingItemsIds(prevIds => prevIds.filter(id => id !== tempId));
      })
      .catch(() => handleErrorMessage('Unable to add a todo'))
      .finally(() => {
        onTempTodo(null);
        setIsDisabled(false);
      });
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedTitleField.length) {
      handleErrorMessage('Title should not be empty');

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
          onChange={event => onTitleField(event.target.value)}
          value={titleField}
          disabled={isDisabled}
          autoFocus
          ref={input => input && input.focus()}
        />
      </form>
    </header>
  );
};
