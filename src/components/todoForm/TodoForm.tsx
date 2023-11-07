import React, {
  useCallback, useContext, useEffect,
  useRef,
} from 'react';
import { TodosContext } from '../../TodosContext';

type Props = {
  onAdd: (val: string) => void,
  setTitle: (val: string) => void,
  title: string,
  isSubmitting: boolean,
};

export const TodoForm: React.FC<Props> = ({
  onAdd, setTitle, title, isSubmitting,
}) => {
  const { setErrorMessage } = useContext(TodosContext);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage('Title should not be empty');

        return;
      }

      onAdd(title.trim());
    }, [title],
  );

  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.current) {
      focusedInput.current.focus();
    }
  }, [isSubmitting]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={focusedInput}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        disabled={isSubmitting}
        onChange={(event) => setTitle(event.target.value)}
      />
    </form>
  );
};
