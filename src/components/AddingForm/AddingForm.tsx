import {
  FC,
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  userId: number,
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>,
  setError: Dispatch<SetStateAction<string>>,
  clearNotification: () => void,
  isInputDisabled: boolean,
};

export const AddingForm: FC<Props> = ({
  userId,
  onSubmit,
  setError,
  clearNotification,
  isInputDisabled,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title) {
      setError('Title cannot be empty');
      clearNotification();

      return;
    }

    await onSubmit({
      title,
      completed: false,
      userId,
    });

    setTitle('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="make all todos active"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
