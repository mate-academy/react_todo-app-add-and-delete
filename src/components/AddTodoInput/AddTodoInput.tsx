import { useEffect, useRef } from 'react';
import { useTodosContext } from '../../hooks/useTodosContext';

type Props = {
  title: string;
  onTitleChange: (title: string) => void;
  isSubmiting: boolean;
};

export const AddTodoInput: React.FC<Props> = ({
  title,
  onTitleChange,
  isSubmiting,
}) => {
  const { isfocusedInput, setIsFocusedInput } = useTodosContext();

  const addTodoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isfocusedInput && addTodoInputRef.current) {
      addTodoInputRef.current.focus();
      setIsFocusedInput(false);
    }
  }, [isfocusedInput, setIsFocusedInput]);

  return (
    <input
      ref={addTodoInputRef}
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={title}
      onChange={event => onTitleChange(event.target.value)}
      disabled={isSubmiting}
    />
  );
};
