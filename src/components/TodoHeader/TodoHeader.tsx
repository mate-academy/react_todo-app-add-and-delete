import { FormEvent, useEffect, useRef, useState } from 'react';
import { ErrorMessages } from '../../types/Todo';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  disabled: boolean;
  onErrorMessage: (errMessage: ErrorMessages) => void;
};
export default function TodoHeader({
  onAddTodo,
  disabled,
  onErrorMessage,
}: Props) {
  const queryInputRef = useRef<HTMLInputElement>(null);
  const [titleTodo, setTitleTodo] = useState('');

  useEffect(() => {
    if (queryInputRef.current) {
      queryInputRef.current.focus();
    }
  }, [disabled]);

  const handlerSubmitTodos = async (event: FormEvent) => {
    event.preventDefault();
    const trimTitle = titleTodo.trim();

    if (!trimTitle) {
      onErrorMessage(ErrorMessages.ERROR_NO_TITLE);

      return;
    }

    try {
      await onAddTodo(trimTitle);
      setTitleTodo('');
    } catch (error) {}
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handlerSubmitTodos}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={titleTodo}
          onChange={e => setTitleTodo(e.target.value)}
          placeholder="What needs to be done?"
          ref={queryInputRef}
          disabled={disabled}
        />
      </form>
    </header>
  );
}
