import { useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { postTodo } from '../../api/todos';
import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorsArgument: (argument: Error | null) => void,
  setTodosList: (arg: Todo[] | []) => void,
  todos: Todo[] | null,
  setTempTodo: (arg: Todo | null) => void,
};

export const Header: React.FC<Props> = ({
  setErrorsArgument,
  setTodosList,
  todos,
  setTempTodo,
}) => {
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const user = useContext(AuthContext);

  const postTodosData = async () => {
    if (user && query) {
      setIsAdding(true);
      setTempTodo({
        id: 0,
        userId: 0,
        title: query,
        completed: false,
      });
      const data = {
        title: query,
        userId: user.id,
        completed: false,
      };

      await postTodo(data)
        .then(todo => {
          if (todos) {
            setTodosList([...todos, todo]);
          } else {
            setTodosList([todo]);
          }
        })
        .catch(() => {
          setErrorsArgument(Error.Add);
        })
        .finally(() => {
          setIsAdding(false);
          setQuery('');
          setTempTodo(null);
        });
    }

    if (!query) {
      setErrorsArgument(Error.Empty);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        postTodosData();
      }}
      >
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          value={query}
        />
      </form>
    </header>
  );
};
