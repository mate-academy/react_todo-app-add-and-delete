import React, { useEffect, useRef, useState } from 'react';
import { createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  hasTodos: boolean;
  handleLoadTodos: () => void;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  hasTodos,
  handleLoadTodos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  const user = React.useContext(AuthContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const addNewTodo = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setQuery('');
    if (user) {
      await createTodo(query, user.id);
      handleLoadTodos();
    }
  };

  return (
    <>
      {hasTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          onClick={async () => {
            // eslint-disable-next-line max-len
            await Promise.all(todos.map((todo: { id: number, completed: boolean }) => updateTodo(todo.id, { completed: !todo.completed })));
            handleLoadTodos();
          }}
        />
      )}

      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </>
  );
};
