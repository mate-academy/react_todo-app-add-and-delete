import {
  memo,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import autoAnimate from '@formkit/auto-animate';
import { TodosContext } from './TodosContext';

export const TodosError = memo(() => {
  const parentRef = useRef(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>();
  const { errors, setErrors } = useContext(TodosContext);
  const { length } = errors;
  const getKey = useCallback((index: number) => `error_${index}`, []);

  const clearErrors = () => {
    setErrors([]);
  };

  const debounceClearErrors = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      clearErrors();
      timeoutId.current = null;
    }, 3000);
  };

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, []);

  if (length) {
    debounceClearErrors();
  }

  return (
    <div
      ref={parentRef}
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!length ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="hide errors"
        onClick={clearErrors}
      />

      {errors.map((error, i) => (
        <p
          key={getKey(i)}
        >
          {error}
        </p>
      ))}
    </div>
  );
});
