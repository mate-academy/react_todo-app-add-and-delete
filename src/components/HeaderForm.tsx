import { useState } from 'react';

type Props = {
  onAddTodo: (title: string) => Promise<boolean>;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
};

export const HeaderForm: React.FC<Props> = ({
  onAddTodo,
  newTodoInputRef,
  isAdding,
}) => {
  const [title, setTitle] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = await onAddTodo(title.trim());

    if (success) {
      setTitle('');
      newTodoInputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        disabled={isAdding}
        onChange={event => setTitle(event.target.value)}
        ref={newTodoInputRef}
        autoFocus
      />
    </form>
  );
};
