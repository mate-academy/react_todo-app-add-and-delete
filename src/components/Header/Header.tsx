import {
  ChangeEventHandler,
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTodos } from '../../providers';

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { onAddTodo: addTodo, isLoading, error } = useTodos();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!error) {
        setInputValue('');
      }

      input.current?.focus();
    }
  }, [error, input, isLoading]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setInputValue(value);

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    addTodo(inputValue.trim());
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isLoading}
          ref={input}
        />
      </form>
    </header>
  );
};
