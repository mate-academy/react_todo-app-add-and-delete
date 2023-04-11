import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  isDisable: boolean,
  onAddTodo: (title: string) => void,
}

export const AddingTodo: React.FC<Props> = (props) => {
  const {
    todos,
    isDisable,
    onAddTodo,
  } = props;

  const [newTitleTodo, setNewTitleTodo] = useState('');

  const isTodos = todos.length > 0;
  const hasCompletedTodo = todos.some((todo: Todo) => todo.completed);

  const handlerTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;

    setNewTitleTodo(title);
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAddTodo(newTitleTodo);

    setNewTitleTodo('');
  };

  return (
    <>
      {isTodos && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: hasCompletedTodo,
            },
          )}
          aria-label="active"
        />
      )}

      <form onSubmit={handlerSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitleTodo}
          onChange={handlerTitle}
          disabled={isDisable}
        />
      </form>
    </>
  );
};
