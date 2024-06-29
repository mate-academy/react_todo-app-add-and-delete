import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

type Props = {
  onSubmit: (title: string) => void;
};

export const TodoForm: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, []);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    onSubmit(title);
    setTitle('');
    setIsSubmitting(false);
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
