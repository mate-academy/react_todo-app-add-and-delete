import { useEffect, useRef, useState } from 'react';

import { Action, Todo } from '../types';
import { createTodo } from '../api';
import { useError, useTodos } from '../providers';
import { ERRORS } from '../utils';

type Props = {
  onCreate: (todo: Todo | null) => void;
};

export const NewTodo: React.FC<Props> = ({ onCreate }) => {
  const { dispatch } = useTodos();
  const { setError } = useError();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = inputValue.trim();

    if (!title) {
      setError(ERRORS.EMPTY_TITLE);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    onCreate({
      id: 0,
      userId: 0,
      title,
      completed: false,
    });

    setError(ERRORS.NONE);

    createTodo(title)
      .then(todo => {
        dispatch({
          type: Action.Add,
          payload: todo,
        });

        setInputValue('');
      })
      .catch(() => {
        setError(ERRORS.ADD_TODO);
      })
      .finally(() => {
        onCreate(null);

        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        data-cy="NewTodoField"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
      />
    </form>
  );
};
