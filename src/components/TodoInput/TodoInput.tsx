import { useEffect, useRef, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';

interface Props {
  onAddTodo: (title: string) => Promise<Todo | null>;
  setCurrentInputElement: (input: HTMLInputElement | null) => void;
  setErrorMessage: (message: ErrorMessages) => void;
}

export const TodoInput: React.FC<Props> = ({
  onAddTodo,
  setErrorMessage,
  setCurrentInputElement: setInputElement,
}) => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInputElement(inputElement.current);

    const inputText = inputElement.current?.value.trim() || '';

    if (inputText === '') {
      setErrorMessage(ErrorMessages.emptyTitleError);

      return;
    }

    setIsRequestPending(true);
    const res = await onAddTodo(inputText);

    if (inputElement.current && res) {
      inputElement.current.value = '';
    }

    setIsRequestPending(false);
  };

  const onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setInputElement(event.currentTarget);
  };

  useEffect(() => {
    setInputElement(inputElement.current);
  }, [setInputElement]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onClick={onClick}
          disabled={isRequestPending}
          ref={inputElement}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </>
  );
};
