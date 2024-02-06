import { useCallback, useEffect, useState } from 'react';

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

    // eslint-disable-next-line no-param-reassign
    onTodoChanged = () => {};
  };

  const keyboardListener = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCanceled();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', keyboardListener);

    return () => window.removeEventListener('keyup', keyboardListener);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
