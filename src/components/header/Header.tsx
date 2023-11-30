import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { addTodo } from '../../api/todos';

interface Props {
  newTodo: (todo: Todo) => void;
  setErrorMessege: (errorText: Error) => void;
  setTempTodo: (todo: Todo | null) => void;
  idUser: number;
}

export const Header: React.FC<Props> = ({
  newTodo,
  setErrorMessege,
  setTempTodo,
  idUser,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputField = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => {
    if (inputField) {
      inputField.current?.focus();
    }
  }, []);

  useEffect(() => handleFocus, [handleFocus]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessege(Error.EmptyTitle);

      return;
    }

    const todo = {
      title: inputValue,
      userId: idUser,
      completed: false,
    };

    const tempTodo = { ...todo, id: 0 };

    setTempTodo(tempTodo);
    addTodo(todo)
      .then(returnTodo => {
        newTodo(returnTodo);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessege(Error.Add);
        setInputValue(inputValue);
      })
      .finally(() => setTempTodo(null));

      handleFocus();
  };

  const handleInputvalueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        aria-label="HideErrorButton"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputvalueChange}
        />
      </form>
    </header>
  );
};
