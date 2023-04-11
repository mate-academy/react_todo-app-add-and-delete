import classNames from 'classnames';
import { FC, FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  itemsCompleted: Todo[];
  addTodo: (title: string) => void,
}

export const TodoInput: FC<Props> = ({
  itemsCompleted,
  addTodo,
}) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    addTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: itemsCompleted.length === 0,
        })}
        aria-label="toggle-button"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
