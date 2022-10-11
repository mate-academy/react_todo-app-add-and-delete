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
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('title not able to be empty');
      setTilte('');

      return;
    }

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
        onSubmit={onHandleAddTodo}
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
