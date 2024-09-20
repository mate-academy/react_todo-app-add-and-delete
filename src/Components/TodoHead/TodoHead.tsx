import { useEffect, useRef, useState } from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todos?: Todo[];
  onAdd: (title: string) => void;
  setError: (eror: Errors) => void;
  resetFlag: number;
  loadingFlag: boolean;
};

export const TodoHead: React.FC<Props> = ({
  onAdd,
  setError,
  resetFlag,
  loadingFlag,
}) => {
  const [title, setTitle] = useState('');
  const inputElem = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputElem.current) {
      inputElem.current.focus();
    }
  }, []);

  useEffect(() => {
    setTitle('');
  }, [resetFlag]);

  useEffect(() => {
    if (!loadingFlag && inputElem.current) {
      inputElem.current.focus();
    }
  }, [loadingFlag, resetFlag]);

  const handleOnsubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (cleanTitle.length <= 0) {
      setError(Errors.title);
    } else {
      onAdd(cleanTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleOnsubmit}>
        <input
          ref={inputElem}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loadingFlag}
        />
      </form>
    </header>
  );
};
