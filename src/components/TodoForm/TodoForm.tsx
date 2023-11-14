import React, {
  useEffect, useRef, useState,
} from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  addTodo: (todo: string) => void;
  changeErrorMessage: (errorMsg: string) => void;

};

export const TodoForm = React.memo(({ addTodo, changeErrorMessage }: Props) => {
  const [todo, setTodo] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todo) {
      addTodo(todo);
    } else {
      changeErrorMessage(ErrorMessages.EMPTY);
    }

    setTodo('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={todo}
        onChange={e => setTodo(e.target.value)}
      />
    </form>
  );
});
