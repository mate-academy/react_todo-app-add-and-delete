/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../constants/USER_ID';

type Props = {
  loading: boolean,
  todos: Todo[]
  addTodo: (newTodo: Todo) => void
  titleField: React.RefObject<HTMLInputElement>
};

export const Form: React.FC<Props> = ({
  loading,
  todos,
  addTodo,
  titleField,
}) => {
  const [value, setValue] = useState('');
  const activeTodos = todos.filter(todo => todo.completed === false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: value,
      completed: false,
    };

    addTodo(newTodo);
    setValue('');
  };

  return (
    <>
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeTodos.length === 0,
        })}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          disabled={loading}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </>
  );
};
