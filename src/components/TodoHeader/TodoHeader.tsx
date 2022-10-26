import {
  useEffect,
  useRef,
} from 'react';
import { createTodo } from '../../api/todos';

/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  userId: number,
  setIsError: (value: string | null) => void,
  isAdding: boolean,
  setIsAdding: (value: boolean) => void,
  newTodoTitle: string,
  setNewTodoTitle: (value: string) => void,
  setTitle: (value: string) => void,
};

export const TodoHeader:React.FC<Props> = ({
  userId,
  setIsError,
  isAdding,
  setIsAdding,
  newTodoTitle,
  setNewTodoTitle,
  setTitle,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle) {
      setIsError('Title can\'t be empty');
    } else {
      setIsAdding(true);
      setTitle(newTodoTitle);
      createTodo(newTodoTitle, userId, false)
        .then(() => (setIsAdding(false)))
        .catch(error => {
          setIsError(`${error}: Unable to add a todo`);
          setIsAdding(false);
        });
      setNewTodoTitle('');
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />

      </form>
    </header>
  );
};
