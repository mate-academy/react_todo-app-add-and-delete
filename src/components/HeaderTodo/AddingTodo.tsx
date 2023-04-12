import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  onAddTodo: (title: string) => void,
}

export const AddingTodo: React.FC<Props> = (props) => {
  const {
    todos,
    onAddTodo,
  } = props;

  const [newTitleTodo, setNewTitleTodo] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  const isHasTodos = todos.length < 1;
  const hasCompletedTodos = todos.some(todo => todo.completed);

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
        />
      </form>
    </>
  );
};
