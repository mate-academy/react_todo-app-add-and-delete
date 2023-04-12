import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodos: number,
  onError: (error: string) => void,
  userId: number,
  onAdd: (todo: Omit<Todo, 'id'>) => void,
  isDisabledInput: boolean,
};

export const Header: React.FC<Props> = ({
  activeTodos,
  userId,
  onAdd,
  isDisabledInput,
}) => {
  const [title, setTitle] = useState('');

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo = {
      title,
      completed: false,
      userId,
    };

    setTitle('');

    onAdd(newTodo);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !activeTodos },
        )}
      >
        {}
      </button>

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleNewTitle}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
