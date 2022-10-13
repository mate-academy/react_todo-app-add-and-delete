/* eslint-disable padding-line-between-statements */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorMessages } from '../../types/Error';

type Props = {
  todos: Todo[];
  newTodoField: React.RefObject<HTMLInputElement>;
  addTodo: (value: string) => void;
  handleError: (isError: boolean, value: ErrorMessages) => void;
};

export const Header: React.FC<Props> = ({
  todos, newTodoField, addTodo, handleError,
}) => {
  const user = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addValue = async (value: string) => {
    if (!value) {
      handleError(true, ErrorMessages.EroroTitle);

      return;
    }
    console.log('yes');
    if (!user) {
      return;
    }

    setIsAdding(true);

    await addTodo(value);

    setIsAdding(false);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValue((e.target as HTMLInputElement).value);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      </form>
    </header>
  );
};
