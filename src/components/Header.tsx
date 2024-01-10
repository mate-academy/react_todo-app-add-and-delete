/* eslint-disable max-len */
/* eslint-disable no-console */
import React, {
  Dispatch, SetStateAction, useEffect, useRef,
} from 'react';
import { postTodo } from '../api/todos';
import { Todo, ErrorType } from '../types';

const USER_ID = 12139;

type Props = {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>
  addTodo: (todo: Todo) => void
  handleError: (error: ErrorType) => void
  setIsLoading: Dispatch<SetStateAction<number[]>>
};

export const Header: React.FC<Props> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTodo, handleError, setTempTodo, setIsLoading,
}) => {
  const inputRef = useRef<any>();
  const formRef = useRef<any>();

  const handleAddTodo = async () => {
    if (inputRef.current.value.trim() === '') {
      handleError(ErrorType.TITLE);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputRef.current.value.trim(),
      completed: false,
    };

    setIsLoading(prev => [...prev, newTodo.id]);
    setTempTodo(newTodo);
    await postTodo(newTodo).then(addTodo);
    setTempTodo(null);
    setIsLoading(prev => prev.filter(id => id !== newTodo.id));

    inputRef.current.value = '';
  };

  useEffect(() => {
    formRef.current.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      handleAddTodo();
    });
  }, []);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="text"
      />

      {/* Add a todo on form submit */}
      <form ref={formRef}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
