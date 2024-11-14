import cn from 'classnames';
import React, { ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { updateTodos, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  posts: Todo[];
  disableInput?: boolean;
  setIsInputLoading: number;
  setTodoTemplate: React.Dispatch<React.SetStateAction<Todo | null>>;
  valueTitle: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  addPost: (event: FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({
  posts,
  setIsInputLoading,
  addPost,
  valueTitle,
  setValue,
  disableInput,
}) => {
  const fieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldFocus.current) {
      fieldFocus.current.focus();
    }
  }, [setIsInputLoading, posts]);

  const setCompleted = () => {
    posts.map(post => {
      const id = post.id;

      updateTodos({
        id: id,
        userId: USER_ID,
        title: post.title,
        completed: !post.completed,
      });
    });
  };

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        data-cy="ToggleAllButton"
        className={cn('todoapp__toggle-all', {
          active: posts.every(post => post.completed),
        })}
        onClick={setCompleted}
      />

      <form onSubmit={event => addPost(event)}>
        <input
          ref={fieldFocus}
          data-cy="NewTodoField"
          type="text"
          onChange={onTextChange}
          value={valueTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
