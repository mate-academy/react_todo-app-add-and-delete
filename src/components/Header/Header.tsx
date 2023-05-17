/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useState } from 'react';
import { TodosContext } from '../../contexts/TodosContext';

export const Header:React.FC = () => {
  const [input, setInput] = useState('');
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const { createTodo, todos } = useContext(TodosContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInput(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsWaitingResponse(true);

    await createTodo(input);

    setIsWaitingResponse(false);
    setInput('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button type="button" className="todoapp__toggle-all active" />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={handleChange}
          disabled={isWaitingResponse}
        />
      </form>
    </header>
  );
};
