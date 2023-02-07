/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { creatTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  submitTodo: (todo: Todo) => void,
  onSetError: (message: string) => void,
  onAddTempTodo: (title: string) => void,
  onSetTempTodo: (tempTodo: null) => void,
  onSetLoading: (isLoading: boolean) => void,
};

export const Header: React.FC<Props> = ({
  submitTodo,
  onSetError,
  onAddTempTodo,
  onSetTempTodo,
  onSetLoading,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const user = useContext(AuthContext);

  const creatNewTodo = async () => {
    setIsDisabled(true);
    onAddTempTodo(title);
    onSetLoading(true);

    try {
      const createdTodo = await creatTodo(title, user?.id || 0);

      submitTodo(createdTodo);
    } catch {
      onSetError('Unable to add a todo');
    } finally {
      setIsDisabled(false);
      onSetTempTodo(null);
      onSetLoading(true);
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
