import { forwardRef, Ref } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  inputValue: string;
  onChangeInput: (value: string) => void;
  onAddTodo: (title: string) => void;
  loading: boolean;
};

export const TodoHeader = forwardRef<HTMLInputElement, Props>(
  (
    { todos, inputValue, onChangeInput, onAddTodo, loading },
    ref: Ref<HTMLInputElement>,
  ) => {
    const areAllCompleted = (todosToCheck: Todo[]) => {
      return todosToCheck.every(todo => todo.completed === true);
    };

    const allDone = areAllCompleted(todos);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onAddTodo(inputValue);
    };

    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allDone,
          })}
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            autoFocus
            ref={ref}
            disabled={loading}
            value={inputValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeInput(event.target.value.trimStart());
            }}
          />
        </form>
      </header>
    );
  },
);

TodoHeader.displayName = 'TodoHeader';
