import React from 'react';

interface Props {
  setNewTodo: (newTodo: string) => void;
  newTodo: string;
  addTodo: (title: string) => void; // Updated the return type to void
}

// eslint-disable-next-line max-len
export const InputOfTodos: React.FC<Props> = ({ setNewTodo, newTodo, addTodo }) => {
  const handleAddNewTodo = () => {
    if (newTodo) { // Removed the unnecessary check
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  // eslint-disable-next-line max-len
  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key press
      handleAddNewTodo();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button is active only if there are some active todos */}
      {/* <button
        type="button"
        className="todoapp__toggle-all active"
      /> */}

      {/* Add a todo on form submit */}
      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
        />
      </form>
    </header>
  );
};
