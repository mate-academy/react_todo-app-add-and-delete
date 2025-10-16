import { Dispatch, SetStateAction } from 'react';
import { createTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { useRef, useEffect } from 'react';

type Props = {
  todoTitle: string;
  setTodoTitle: Dispatch<SetStateAction<string>>;
  onTodoAdded: (todo: Todo) => void;
  onError: (error: string) => void;
  onAddingStart: () => void;
  onAddingEnd: () => void;
  isAdding: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todoTitle,
  setTodoTitle,
  onTodoAdded,
  onError,
  onAddingStart,
  onAddingEnd,
  isAdding,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todoTitle.trim()) {
      onError('Title should not be empty');

      return;
    }

    onAddingStart();
    try {
      const newTodo = await createTodo({
        userId: Number(USER_ID),
        title: todoTitle.trim(),
        completed: false,
      });

      onTodoAdded(newTodo);

      setTodoTitle('');
    } catch (error) {
      onError('Unable to add a todo');
    } finally {
      onAddingEnd();
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
