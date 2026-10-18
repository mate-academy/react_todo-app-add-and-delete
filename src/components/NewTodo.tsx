import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

export interface NewTodoRef {
  focus: () => void;
}

interface Props {
  onSubmit: (title: string) => Promise<void>;
  isSubmitting: boolean;
  onError: (msg: string) => void;
}

export const NewTodo = forwardRef<NewTodoRef, Props>(
  ({ onSubmit, isSubmitting, onError }, ref) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (!isSubmitting) {
        inputRef.current?.focus();
      }
    }, [isSubmitting]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        onError('Title should not be empty');

        return;
      }

      try {
        await onSubmit(trimmedTitle);
        setTitle('');
      } catch {
        // Помилка обробляється у батьківському компоненті
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
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    );
  },
);

NewTodo.displayName = 'NewTodo';

NewTodo.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
};
