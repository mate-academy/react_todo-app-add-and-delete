import { useState } from 'react';

interface Props {
  addTodo: React.Dispatch<React.SetStateAction<string | undefined>>,
}

export const TodoForm: React.FC<Props> = ({ addTodo }) => {
  const [titleValue, setTitleValue] = useState('');

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          addTodo(titleValue);
          setTitleValue('');
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleValue}
          onChange={(ev) => setTitleValue(ev.currentTarget.value)}
        />
      </form>
    </header>
  );
};
