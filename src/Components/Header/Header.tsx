import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from 'react';

type Props = {
  todosLength: number;
  completedTodosLength: number;
  addNewTodo: (value: string) => Promise<void>;
};

const Header: React.FC<Props> = ({
  todosLength,
  completedTodosLength,
  addNewTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');
  const [isSubmitValue, setSubmitValue] = useState(false);

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitValue(true);
    addNewTodo(value)
      .finally(() => {
        setValue('');
        setSubmitValue(false);
        inputRef.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={
            classNames(
              'todoapp__toggle-all',
              { active: completedTodosLength === todosLength },
            )
          }
          aria-label="select all"
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={onChangeValue}
          disabled={isSubmitValue}
        />
      </form>
    </header>
  );
};

export default Header;
