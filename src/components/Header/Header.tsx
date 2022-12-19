/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useEffect, useRef, useState, useContext, memo,
} from 'react';
import { addTodo } from '../../api/todos';
import { TodoErrors } from '../../types/ErrorMessages';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  onError: React.Dispatch<React.SetStateAction<TodoErrors>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  onCompleteAll: () => void,

}

export const Header: FC<Props> = memo(({
  onError, setIsLoading, onCompleteAll,
}) => {
  const [input, setInput] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const user = useContext(AuthContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && input.trim().length > 0) {
      setIsAdding(true);

      const newTodo = {
        userId: user.id,
        title: input,
        completed: false,
      };

      try {
        await addTodo(newTodo);
        setIsLoading(true);
      } catch (error) {
        onError(TodoErrors.onAdd);
      } finally {
        setIsAdding(false);
      }
    } else {
      onError(TodoErrors.onEmptyTitle);
    }

    setInput('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={onCompleteAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          name="title"
          value={input}
          onChange={handlInputChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
