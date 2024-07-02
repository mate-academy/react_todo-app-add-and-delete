import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { wait } from '../../utils/fetchClient';

type Props = {
  onSubmit: (title: string) => Promise<void>;
  setTitleError: (value: boolean) => void;
};

export const TodoForm: React.FC<Props> = ({ onSubmit, setTitleError }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, [title, isSubmitting, onSubmit]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      wait(3000).then(() => setTitleError(false));
    }

    if (title.trim()) {
      setIsSubmitting(true);
      onSubmit(title.trim())
        .then(() => {
          setTitle('');
        })
        .catch(() => setTitle(title))
        .finally(() => setIsSubmitting(false));
    }
  };

  return (
    <>
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        // className={classNames("todoapp__toggle-all", { "active": todo.completed})}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleFormSubmit}>
        <input
          value={title}
          ref={titleField}
          autoFocus
          disabled={isSubmitting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
        />
      </form>
    </>
  );
};

// const [tempTodo, setTempTodo] = useState<Todo | null>()
// {tempTodo && <..............>}
