import { FC, useState } from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  USER_ID: number;
  setTempTodo: (tempTodo: Todo | null) => void;
  setIsEmplty: (isEmpty: boolean) => void;
}

const getNewId = (todos: Todo[]) => {
  return todos.reduce((acum: number, { id }: Todo) => {
    if (acum < id) {
      return id;
    }

    return acum;
  }, 0) + 1;
};

export const HeaderTodoApp: FC<Props> = ({
  todos,
  USER_ID,
  setTempTodo,
  setIsEmplty,
}) => {
  const [query, setQuery] = useState('');

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (!query) {
            setIsEmplty(true);
            setTimeout(() => {
              setIsEmplty(false);
            }, 2000);

            return;
          }

          setTempTodo({
            id: getNewId(todos),
            userId: USER_ID,
            title: query,
            completed: false,
          });

          addTodo({
            id: getNewId(todos),
            userId: USER_ID,
            title: query,
            completed: false,
          });

          setQuery('');
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
