import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

interface TodoHeaderProps {
  todos: { completed: boolean }[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddTodo: (e: React.FormEvent) => void;
  onToggleAll: () => void;
  isLoading?: boolean;
}

export interface TodoHeaderHandle {
  focus: () => void;
}

export const TodoHeader = forwardRef<TodoHeaderHandle, TodoHeaderProps>(
  (
    { todos, inputValue, onInputChange, onAddTodo, onToggleAll, isLoading },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      // Коли isLoading змінюється з true на false (успішне додавання або помилка)
      // фокусуємо input
      if (!isLoading && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
      onAddTodo(e);
    };

    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={`todoapp__toggle-all${
              todos.every(todo => todo.completed) ? ' active' : ''
            }`}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />
        )}

        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            autoFocus
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);

TodoHeader.displayName = 'TodoHeader';
