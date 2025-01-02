import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorTodos: Dispatch<SetStateAction<ErrorType>>;
  isTempTodo: boolean;
  todosLength: number;
};

export const TodoHeader: FC<Props> = ({
  onAddTodo,
  setErrorTodos,
  isTempTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isTempTodo]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorTodos(ErrorType.Empty);
    if (inputValue.trim() === '') {
      setErrorTodos(ErrorType.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {
      setErrorTodos(ErrorType.AddTodo);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
