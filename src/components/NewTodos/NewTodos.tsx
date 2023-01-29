import React, { FormEvent, memo, useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  showErrorMessage: (message: string) => void;
  isAddingTodo: boolean;
  onAddTodo: (fieldsForCreate: Omit<Todo, `id`>) => void;
  userId?: number;
};

export const NewTodos: React.FC<Props> = memo((props) => {

  const {
    newTodoField,
    showErrorMessage,
    isAddingTodo,
    onAddTodo,
  } = props;
  const user = useContext(AuthContext)
  const [title, setTitle] = useState('');



  const handleForSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      showErrorMessage('Title can\'t be empty');
      return;
    }

    if (!user) {
      showErrorMessage('User not found');

      return;
    }

    onAddTodo({
      title,
      userId: user.id,
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleForSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          disabled={isAddingTodo}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
