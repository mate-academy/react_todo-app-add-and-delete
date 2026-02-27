import React from 'react';
import { ErrorMessage } from '../types/enums';
import { Todo } from '../types/Todo';

interface Props {
  USER_ID: number;
  addTodo: (title: string) => Promise<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setShowError: React.Dispatch<React.SetStateAction<'' | ErrorMessage>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  todoFieldRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  USER_ID,
  addTodo,
  setTodos,
  setShowError,
  setTempTodo,
  todoFieldRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('newTodo') as HTMLInputElement;
          const title = input.value.trim();

          if (title) {
            const newTempTodo: Todo = {
              id: 0,
              userId: USER_ID,
              title,
              completed: false,
            };

            addTodo(title)
              .then(newTodo => {
                setTodos(prevTodos => [...prevTodos, newTodo]);
                setTempTodo(null);
                input.value = '';
              })
              .catch(() => {
                setShowError(ErrorMessage.Add);
                setTempTodo(null);
              })
              .finally(() => {
                input.disabled = false;
                input.focus();
              });

            setTempTodo(newTempTodo);
            input.disabled = true;
          } else {
            setShowError(ErrorMessage.EmptyTitle);
          }
        }}
      >
        <input
          ref={todoFieldRef}
          data-cy="NewTodoField"
          type="text"
          name="newTodo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
        />
      </form>
    </header>
  );
};
