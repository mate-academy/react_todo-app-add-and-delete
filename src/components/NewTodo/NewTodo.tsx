import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useNewTodo } from '../../CustomHooks/useNewTodo';
import { useTodosContext } from '../../providers/TodosProvider/TodosProvider';
import { useErrorsContext }
  from '../../providers/ErrorsProvider/ErrorsProvider';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const NewTodo = () => {
  const [todoTitle, setTodoTitle] = useState<string>('');

  const { addTodo } = useNewTodo();
  const { todos, uploading, clearInput } = useTodosContext();
  const { addError } = useErrorsContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (clearInput) {
      setTodoTitle('');
    }
  }, [clearInput]);

  useEffect(() => {
    if (uploading.length === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [uploading, todoTitle]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed === true),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!todoTitle) {
          return addError('errorEmptyTitle');
        }

        return (
          addTodo({
            title: todoTitle.trim(),
            completed: false,
          })
        );
      }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value.trimStart())}
          disabled={uploading.length !== 0}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};
