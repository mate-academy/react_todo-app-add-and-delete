import { FormEvent, useEffect, useRef, useState } from 'react';

type Props = {
  onAddTodo: (title: string) => void;
  disabled: boolean;
};
export default function TodoHeader({ onAddTodo, disabled }: Props) {
  const queryInputRef = useRef<HTMLInputElement>(null);
  const [titleTodo, setTitleTodo] = useState('');

  useEffect(() => {
    if (queryInputRef.current) {
      queryInputRef.current.focus();
    }
  }, [disabled]);

  const handlerSubmitTodos = (event: FormEvent) => {
    event.preventDefault();
    const trimTitle = titleTodo.trim();

    if (!trimTitle) {
      return;
    }

    onAddTodo(trimTitle);
    setTitleTodo('');
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
