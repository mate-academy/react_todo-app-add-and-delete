import { RefObject, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  setFormError: (error: ErrorMessage | null) => void;
  inputField: RefObject<HTMLInputElement>;
  onFormSubmit: (todo: Todo) => Promise<void>;
  processings: Set<number>;
};

export const NewTodo: React.FC<Props> = ({
  inputField,
  onFormSubmit,
  setFormError,
  processings,
}) => {
  const [title, setTitle] = useState('');
  const isProcessed = processings.has(0);

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!title || title.trim() === '') {
      setFormError(ErrorMessage.NO_TITLE);
      setTitle('');

      return;
    }

    const trimmedTitle = title.trim();

    onFormSubmit({
      id: 0,
      userId: 3779,
      title: trimmedTitle,
      completed: false,
    }).then(reset);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        id="formInput"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputField}
        value={title}
        disabled={isProcessed}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
};
