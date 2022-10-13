import React, {
  FormEvent,
  useEffect,
  useRef,
} from 'react';

interface Props {
  addTodo: (value: string) => void;
  isAdding: boolean;
}

export const NewTodo: React.FC<Props> = ({ addTodo, isAdding }) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (newTodoField.current) {
      addTodo(newTodoField.current.value);
      newTodoField.current.value = '';
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAll"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
