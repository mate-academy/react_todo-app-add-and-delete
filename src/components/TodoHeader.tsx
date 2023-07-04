/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  createTodo: (title: string) => Promise<Todo>;
}

export const TodoHeader: FC<Props> = ({ createTodo }) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!title) {
      return;
    }

    event.preventDefault();
    setIsDisabled(true);

    await createTodo(title);

    setIsDisabled(false);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
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
