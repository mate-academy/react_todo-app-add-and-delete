import React, { useContext, useEffect, useState } from 'react';
import { ErrorContext } from '../../contexts/ErrorContext';
import { FormInputContext } from '../../contexts/FormInputContext';

type Props = {
  onSubmit(title: string): Promise<void>;
};

export const TodoForm: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const { setError } = useContext(ErrorContext);
  const { focus, ref, setDisabled } = useContext(FormInputContext);

  useEffect(() => {
    focus();
  }, [focus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError({ message: '' });
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError({ message: 'Title should not be empty' });

      return;
    }

    setDisabled(true);

    onSubmit(trimmedTitle)
      .then(() => setTitle(''))
      .finally(() => {
        setDisabled(false);
        focus();
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={ref}
        value={title}
        onChange={event => setTitle(event.target.value)}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
