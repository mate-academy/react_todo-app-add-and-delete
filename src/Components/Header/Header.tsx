import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  setError: React.Dispatch<string | null>;
  addTodo: (title: string) => Promise<void>;
}

export const Header: FC<Props> = ({
  addTodo,
  setError,
}) => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizeTitle = value.trim();

    if (!normalizeTitle) {
      setError('Title can\'t be empty');

      return;
    }

    setIsLoading(true);

    await addTodo(normalizeTitle);

    setIsLoading(false);
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
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="Toggle All"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={handleChangeInput}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
