import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  focusTrigger: number;
};

export const NewTodoForm: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  isSubmitting,
  focusTrigger,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      titleField.current?.focus();
    }
  }, [isSubmitting, focusTrigger]);

  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isSubmitting}
        ref={titleField}
      />
    </form>
  );
};
