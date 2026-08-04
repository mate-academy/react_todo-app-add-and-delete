import PropTypes from 'prop-types';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { FormEvent } from 'react';

type Props = {
  isAdding: boolean;
  onAdd: (title: string) => Promise<boolean>;
  onEmptyTitle: () => void;
};

export type NewTodoHandle = {
  focus: () => void;
};

export const NewTodo = forwardRef<NewTodoHandle, Props>(
  ({ isAdding, onAdd, onEmptyTitle }, ref) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
      inputRef.current?.focus();
    };

    useImperativeHandle(ref, () => ({
      focus: focusInput,
    }));

    useEffect(() => {
      if (!isAdding) {
        focusInput();
      }
    }, [isAdding]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        onEmptyTitle();
        focusInput();

        return;
      }

      const wasAdded = await onAdd(trimmedTitle);

      if (wasAdded) {
        setTitle('');
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding}
          autoFocus
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    );
  },
);

NewTodo.displayName = 'NewTodo';

NewTodo.propTypes = {
  isAdding: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEmptyTitle: PropTypes.func.isRequired,
};
