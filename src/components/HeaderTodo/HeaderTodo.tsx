import React, { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  onAddTodo: (title: string) => void,
  hasCompletedTodos: boolean,
}

export const HeaderTodo: React.FC<Props> = (props) => {
  const {
    todos,
    onAddTodo,
    hasCompletedTodos,
  } = props;

  const [newTitleTodo, setNewTitleTodo] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHasTodos = todos.length < 1;

  useEffect(() => {
    return () => {
      inputRef.current?.focus();
    };
  }, [inputDisabled]);

  const handlerTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;

    setNewTitleTodo(title);
  };

  const handlerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setInputDisabled(true);
    await onAddTodo(newTitleTodo);

    setInputDisabled(false);
    setNewTitleTodo('');
  };

  return (
    <>
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: hasCompletedTodos,
            'is-invisible': isHasTodos,
          },
        )}
        aria-label="active"
      />

      <form onSubmit={handlerSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitleTodo}
          onChange={handlerTitle}
          disabled={inputDisabled}
          ref={inputRef}
        />
      </form>
    </>
  );
};
