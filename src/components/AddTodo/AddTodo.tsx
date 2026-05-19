import React, { ChangeEvent, FormEvent, useState } from 'react';
import { SetState } from '../../types/react';

type Props = {
  onChange: () => void;
  onSubmit: (title: string) => Promise<void>;
  onError: SetState<string>;
};

export const AddTodo: React.FC<Props> = ({ onChange, onSubmit, onError }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  function handleChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    onChange();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const titleTrimmed = title.trim();

    if (!titleTrimmed) {
      onError('Title should not be empty');

      return;
    }

    setLoading(true);
    onSubmit(titleTrimmed)
      .then(() => {
        setTitle('');
      })
      .finally(() => {
        setLoading(false);
        setCount(count + 1);
      });
  }

  return (
    <form onSubmit={handleSubmit} key={count}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={title}
        onChange={handleChangeTitle}
        disabled={loading}
      />
    </form>
  );
};
