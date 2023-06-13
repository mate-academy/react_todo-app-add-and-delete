import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoHeaderProps {
  handleToggleAll: () => void,
  addTodo: (title: string) => void,
  todos: Todo[];
  activeTodo: number,
  isDisabled: boolean,
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  handleToggleAll, todos, addTodo, isDisabled, activeTodo,
}) => {
  const [addingTodo, setAddingTodo] = useState('');

  const handleSumbmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(addingTodo);
    setAddingTodo('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: activeTodo === 0 })}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSumbmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={addingTodo}
          onChange={({ target }) => setAddingTodo(target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
