import cn from 'classnames';
import React, { useRef, useState } from 'react';

import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';

type Props = {
  isAllCompleted: boolean;
  onAdd: (todo: Todo) => void;
};

export const Header: React.FC<Props> = ({ isAllCompleted, onAdd }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (newTodoTitle.trim() !== '') {
      const newUserTodo: Omit<Todo, 'id'> = {
        userId: 12036,
        title: newTodoTitle,
        completed: false,
      };

      const addedTodo = await addTodo(newUserTodo);

      onAdd(addedTodo);

      setNewTodoTitle('');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllCompleted })}
        data-cy="ToggleAllButton"
        aria-labelledby="button-label"
      />

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
