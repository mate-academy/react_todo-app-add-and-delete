import { useEffect, useState } from 'react';

interface Props {
  onTodoChanged: (newTitle: string) => void,
  onCanceled: () => void,
  initialTitle: string,
}

export const EditTodoForm: React.FC<Props> = ({
  onTodoChanged,
  onCanceled,
  initialTitle,
}) => {
  const [newTitle, setNewTitle] = useState(initialTitle);

  const handleBlur = () => {
    onTodoChanged(newTitle);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onTodoChanged(newTitle);
  };

  const keyboardListener = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCanceled();
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', keyboardListener);

    return () => window.removeEventListener('keyup', keyboardListener);
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={event => setNewTitle(event.target.value)}
        onBlur={handleBlur}
      />
    </form>
  );
};
