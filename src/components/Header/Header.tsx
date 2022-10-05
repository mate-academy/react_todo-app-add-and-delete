import { FormEvent, useState } from 'react';
import { Props } from './HeaderPropTypes';

export const Header : React.FC<Props> = ({
  newTodoField,
  addTodo,
  isAdding,
  setErrorMessage,
}) => {
  const [title, setTilte] = useState('');

  const onHandleAddTodo = (event: FormEvent) => {
    if (!title.trim()) {
      setErrorMessage('title not able to be empty');
      setTilte('');

      return;
    }

    event.preventDefault();
    setTilte('');
    addTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="delete"
        data-cy="ToggleAllButton"
        type="submit"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={(event) => onHandleAddTodo(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          onChange={(event) => {
            if (!isAdding) {
              setTilte(event.target.value);
            }
          }}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
