import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  isAllTodosComplete: () => boolean;
  onAdd: (
    event: React.FormEvent<Element>,
    todoTitle: string,
    setTodoTitle: React.Dispatch<React.SetStateAction<string>>,
  ) => Promise<void>;
  newTodoField: React.RefObject<HTMLInputElement>;
  isTodosExists: () => boolean;
  onToggles: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  isAllTodosComplete,
  onAdd,
  newTodoField,
  isTodosExists,
  onToggles,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  useEffect(() => {
    if (isAddingTodo === false) {
      newTodoField.current?.focus();
    }
  }, [isAddingTodo, newTodoField]);

  return (
    <header className="todoapp__header">
      {isTodosExists() && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosComplete(),
          })}
          onClick={onToggles}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={async event => {
          setIsAddingTodo(true);
          await onAdd(event, todoTitle.trim(), setTodoTitle);
          setIsAddingTodo(false);
        }}
      >
        <input
          data-cy="NewTodoField"
          onChange={event => setTodoTitle(event.target.value)}
          value={todoTitle}
          ref={newTodoField}
          disabled={isAddingTodo}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
