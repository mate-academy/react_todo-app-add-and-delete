import { useEffect, useRef, useState } from 'react';
import { Errors } from '../types/Errors';

interface Props {
  onSubmit: (title: string) => Promise<void>,
  setHasTitleError: (error: Errors | null) => void;
}

export const TodoInput: React.FC<Props> = ({ onSubmit, setHasTitleError }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      (inputField.current.focus());
    }
  }, [isSubmitting]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setTitle('');

      return setHasTitleError(Errors.TitleShouldNotBeEmpty);
    }

    setTitle(title.trim());
    setIsSubmitting(true);

    return onSubmit(title)
      .then(() => setTitle(''))
      .finally(() => setIsSubmitting(false));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHasTitleError(null);
    const { value } = event.target;

    setTitle(value);
  };

  return (

    <form onSubmit={handleSubmit}>
      <input
        ref={inputField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChange}
        disabled={isSubmitting}
        required
      />
    </form>

  );
};
