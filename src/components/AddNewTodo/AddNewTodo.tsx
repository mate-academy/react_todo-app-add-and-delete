import { useEffect, useRef, useState } from 'react';
import { postTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  setErrorMessage: (message: string) => void;
  addTodo: (newTodo: Todo) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  focusRequested: boolean;
}

export const AddNewTodo: React.FC<Props> = ({
  setErrorMessage,
  addTodo,
  setTempTodo,
  focusRequested,
}) => {
  const [title, setTitle] = useState('');
  const inputElementRef = useRef<HTMLInputElement>(null);

  const checkInputFocus = () =>
    document.activeElement === inputElementRef.current;

  const focusInput = () => {
    inputElementRef.current?.focus();
  };

  useEffect(() => {
    if (focusRequested && !checkInputFocus()) {
      focusInput();
    }
  }, [focusRequested]);

  const resetForm = () => setTitle('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    // FORM VALIDATION
    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    // FORM SUBMISSION
    const todoPromise: Promise<Todo> = postTodo(trimmedTitle);

    const inputElement = inputElementRef.current as HTMLInputElement;

    inputElement.disabled = true;
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    todoPromise
      .then(newTodo => {
        addTodo(newTodo);
        setTempTodo(null);
        resetForm();
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        inputElement.disabled = false;
        inputElement.focus();
      });
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'enter') {
      const target = e.target as HTMLInputElement;
      const form = target.parentNode as HTMLFormElement;

      form.submit();
    }
  };

  return (
    // Add a todo on form submit
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={inputElementRef}
        value={title}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onKeyDown={onEnter}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />
    </form>
  );
};
