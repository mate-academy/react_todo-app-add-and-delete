/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CurrentError } from '../types/CurrentError';
import { TodoContext } from '../Context/TodoContext';

type Props = {
  activeTodosCount: number,
};

export const TodoHeader: React.FC<Props> = ({
  activeTodosCount,
}) => {
  const { setError } = useContext(TodoContext);
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setTitle(newTitle.trimStart());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setError(CurrentError.EmptyTitleError);
    }

    setTitle('');
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {!!activeTodosCount && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            handleTitleChange(event);
          }}
        />
      </form>
    </header>
  );
};
