/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { creatTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  submitTodo: (todo: Todo) => void
  onSetError: (message: string) => void
};

export const Header: React.FC<Props> = ({ submitTodo, onSetError }) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const user = useContext(AuthContext);

  const creatNewTodo = async () => {
    setIsDisabled(true);

    try {
      const createdTodo = await creatTodo(title, user?.id || 0);

      submitTodo(createdTodo);
    } catch {
      onSetError('Unable to add a todo');
    } finally {
      setIsDisabled(false);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title) {
      creatNewTodo();
      setTitle('');
    } else {
      onSetError('Title can\'t be empty');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
