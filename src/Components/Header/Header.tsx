import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Submits } from '../../types/Submits';

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
  const [submitState, setSubmitState] = useState(Submits.none);

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitState(Submits.pending);
    addNewTodo(value)
      .finally(async () => {
        setValue('');
        setSubmitState(Submits.success);
      });
  };

  useEffect(() => {
    if (submitState !== Submits.success) {
      return;
    }

    inputRef.current?.focus();
  }, [submitState]);

  const onBlurInput = () => {
    setSubmitState(Submits.none);
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
          disabled={submitState === Submits.pending}
          onBlur={onBlurInput}
        />
      </form>
    </header>
  );
};

export default Header;
