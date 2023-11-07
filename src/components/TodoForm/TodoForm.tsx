import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';
// import { USER_ID } from '../../App';

type Props = {
  todos: Todo[];
  setTempTodo: (value: Todo | null) => void;
  setTodos: (value: Todo[]) => void;
  setErrorMessage: (messgae: string) => void;
  setIsShowError: (value: boolean) => void;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  setTempTodo,
  setTodos,
  setErrorMessage,
  setIsShowError,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [titleField]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (inputValue.trim()) {
      const newTodo = {
        id: 0,
        userId: 11827,
        title: inputValue.trim(),
        completed: false,
      };

      setIsInputDisabled(true);
      setTempTodo(newTodo);

      addTodo(newTodo)
        .then((todo) => {
          setTodos([...todos, todo]);
          setInputValue('');
        })
        .catch((error) => {
          setErrorMessage('Unable to add a todo');
          setIsShowError(true);
          throw error;
        })
        .finally(() => {
          setTempTodo(null);
          setIsInputDisabled(false);
        });
    } else {
      setErrorMessage('Title should not be empty');
      setIsShowError(true);
    }

    // if (inputValue.trim()) {
    //   addTodoHandler({
    //     id: todos?.id || 0,
    //     title: inputValue,
    //     completed: false,
    //     userId: 11827,
    //   });
    //   setInputValue('');
    // } else {
    //   setErrorMessage('Title should not be empty');
    //   setIsShowError(true);
    // }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        aria-label="toggle button"
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={isInputDisabled}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
