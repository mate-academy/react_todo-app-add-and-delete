import {
  useEffect,
  useRef,
} from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  isAdding: boolean,
  newTodoTitle: string,
  setNewTodoTitle: (value: string) => void,
  handlerSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void,
};

export const TodoHeader:React.FC<Props> = ({
  isAdding,
  newTodoTitle,
  setNewTodoTitle,
  handlerSubmitForm,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

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

      <form onSubmit={handlerSubmitForm}>
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
