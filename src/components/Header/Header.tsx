import React, { useContext, useEffect, useState } from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

import { AuthContext } from '../Auth/AuthContext';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isAdding: boolean;
  onIsAdding: (creating: boolean) => void;
  onAddingTitle: (title: string) => void;
  onErrorMessage: (message: string) => void;
};

export const Header: React.FC<Props> = React.memo(({
  newTodoField,
  todos,
  onTodos,
  isAdding,
  onIsAdding,
  onAddingTitle,
  onErrorMessage,
}) => {
  const user = useContext(AuthContext) as User;
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleInputField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      onErrorMessage('Title can\'t be empty');

      return;
    }

    onIsAdding(true);
    onAddingTitle(title);

    const newTodo = {
      title,
      userId: user.id,
      completed: false,
    };

    addTodo(newTodo)
      .then(createdTodo => {
        onTodos(current => [...current, createdTodo]);
      })
      .catch(() => onErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTitle('');
        onIsAdding(false);
        onAddingTitle('');
      });
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="ToggleAllButton"
        hidden={todos.length === 0}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={newTodoField}
          disabled={isAdding}
          value={title}
          onChange={handleInputField}
        />
      </form>
    </header>
  );
});
