import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  handleToggleAll: () => void,
  addTodo: (title: string) => void,
  todos: Todo[];
  notCompletedTodo: number,
  isDisabled: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  handleToggleAll, todos, addTodo, isDisabled, notCompletedTodo,
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleSumbmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(newTodo);
    setNewTodo('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: notCompletedTodo === 0 })}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSumbmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={({ target }) => setNewTodo(target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
