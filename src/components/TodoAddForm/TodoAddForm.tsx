import { FormEvent, LegacyRef } from 'react';
import { Errors } from '../../types/Errors';

interface Props {
  isAdding: boolean;
  newTodoField: LegacyRef<HTMLInputElement> | undefined;
  newTodoTitle: string;
  onTitleChange: (title:string) => void;
  onAdd: () => void;
  changeErrors: (errors: Errors | null) => void;
}

export const TodoAddForm: React.FC<Props> = ({
  isAdding,
  newTodoField,
  newTodoTitle,
  onTitleChange,
  onAdd,
  changeErrors,
}) => {
  const handleOnSubmit = (e:FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim || newTodoTitle.trim().length < 5) {
      changeErrors(Errors.onTitleError);
      onTitleChange('');

      return;
    }

    onAdd();
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="Switch"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleOnSubmit}>
        <input
          disabled={isAdding}
          value={newTodoTitle}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
