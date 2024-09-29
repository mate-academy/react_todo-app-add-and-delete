import React, { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, USER_ID } from '../api/todos';

interface Props {
  todos: Todo[];
  onError: (error: Error) => void;
  setTempTodo: (todo: Todo | null) => void;
  onSuccess: (todos: Todo[]) => void;
  setIsHidden: (value: boolean) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  onError,
  setTempTodo,
  onSuccess,
  setIsHidden,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  if (input.current) {
    input.current.focus();
  }

  const inputHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    setTodoTitle(event.target.value.trim());
  };

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter') {
      setIsHidden(true);
      if (todoTitle) {
        setTempTodo({
          title: todoTitle,
          completed: false,
          userId: USER_ID,
          id: 0,
        });
        setIsDisabled(true);
      }

      addTodo({
        title: todoTitle,
        completed: false,
        userId: USER_ID,
      })
        .then(post => {
          onSuccess([...todos, post]);
          setTodoTitle('');
        })
        .catch(message => {
          onError(message);
        })
        .finally(() => {
          setTempTodo(null);
          setIsDisabled(false);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}
      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          autoFocus
          ref={input}
          onChange={inputHandler}
          onKeyDown={onEnter}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
