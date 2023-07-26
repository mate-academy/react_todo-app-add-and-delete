import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../GlobalStateProvider';

type Props = {
  onSubmit: (title: string) => void;
  todoTitle?: string;
};

export const Form = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      onSubmit,
      todoTitle = '',
    },
    ref,
  ) => {
    const [title, setTitle] = useState<string>(todoTitle);
    const { loading } = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        dispatch({ type: 'SET_ERROR', payload: "Title can't be empty" });

        return;
      }

      onSubmit(title);

      setTitle('');
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          type="text"
          className={
            classNames({
              'todoapp__new-todo': !ref,
              'todo__title-field': ref,
            })

          }
          placeholder={
            ref
              ? 'Empty todo will be deleted'
              : 'What needs to be done?'
          }
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
        />
      </form>
    );
  },
);
