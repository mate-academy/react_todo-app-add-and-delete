import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../enums/ErrorMessage';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  isAllFinished: boolean,
  setError: React.Dispatch<React.SetStateAction<ErrorMessage | null>>,
  addTodo: (title: string) => void,
  isAdding: boolean,
};

export const NewTodo: React.FC<Props> = ({
  isAllFinished,
  setError,
  addTodo,
  isAdding,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement | null>(null);
  const user = useContext(AuthContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!todoTitle) {
      setError(ErrorMessage.EMPTY);
      return;
    }

    addTodo(todoTitle.trim());
    setTodoTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [user]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="ToggleAll"
        type="button"
        className={classNames('todoapp__toggle-all', { active: isAllFinished })}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.currentTarget.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
