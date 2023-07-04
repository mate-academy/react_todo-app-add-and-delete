import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  isLoadingTodo: boolean;
  setError: React.Dispatch<string | null>;
  addTodo: (title: string) => Promise<void>;
}

export const Header: FC<Props> = ({
  isLoadingTodo,
  addTodo,
  setError,
}) => {
  const [value, setValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizeTitle = value.trim();

    if (!normalizeTitle) {
      setError('Title can\'t be empty');

      return;
    }

    await addTodo(normalizeTitle);

    setValue('');
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // added that to keep element in focus after adding todo
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoadingTodo]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={handleChangeInput}
          disabled={isLoadingTodo}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
