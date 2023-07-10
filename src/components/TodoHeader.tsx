/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  showError: (message: string) => void;
  createTodo: (title: string) => void;
  todos:Todo[];
}

export const TodoHeader: FC<Props> = ({
  createTodo,
  showError,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      showError('Title can not be empty');

      return;
    }

    setIsDisabled(true);

    createTodo(title);

    setIsDisabled(false);
    setTitle('');
  };

  const isActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all',
          { active: isActive })}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={title}
          onChange={(event) => setTitle(event.target.value)}

        />
      </form>
    </header>
  );
};
