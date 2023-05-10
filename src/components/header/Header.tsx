import { FormEvent, useState } from 'react';
import { addTodo } from '../../api/todos';

interface Props {
  setError: (errText: string) => void;
  userId: number;
}

export const Header: React.FC<Props> = ({ userId, setError }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await addTodo({
        title: inputValue,
        userId,
        completed: false,
      });
    } catch {
      setError('add');
    }

    setInputValue('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          value={inputValue}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => {
            setInputValue(event.target.value);
            setError('');
          }}
        />
      </form>
    </header>
  );
};
