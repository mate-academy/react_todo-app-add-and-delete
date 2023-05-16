import { FC, FormEvent, useState } from 'react';
import { TodoError } from '../../types/TodoError';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../consts/consts';

interface Props {
  onAddTodo: (todo: Todo) => void;
  onError: (message: TodoError) => void;
}

export const Header: FC<Props> = ({ onAddTodo, onError }) => {
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      onError(TodoError.EMPTY_TITLE);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsInputDisabled(true);
    onAddTodo(tempTodo);
    setIsInputDisabled(false);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
