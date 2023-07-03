import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { showError } from '../helpers/helpers';
import { addTodos } from '../api/todos';

interface Props {
  todos: Todo[],
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const Header: React.FC<Props> = ({
  todos,
  setSearchQuery,
  searchQuery,
  setError,
  setTempTodo,
  setTodos,
}) => {
  const [submitDisable, setSubmitDisable] = useState(false);
  const activeInputButton = todos.some(todo => !todo.completed);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    (setSearchQuery(event.target.value));
  };

  const newTodo = {
    id: 0,
    title: searchQuery,
    userId: 10881,
    completed: false,
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitDisable(true);
    if (!searchQuery) {
      showError('Title can\'t be empty', setError);
      setSubmitDisable(false);
    } else {
      addTodos(10881, searchQuery)
        .then(todo => {
          setTodos(prevState => {
            setTempTodo(null);
            setSubmitDisable(false);
            setSearchQuery('');

            return [...prevState, todo];
          });
        })
        .catch(() => showError('Unable to add a todo', setError));
      setTempTodo(newTodo);
    }
  };

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          <button
            aria-label="complete all tasks"
            type="button"
            className={cn('todoapp__toggle-all', {
              active: activeInputButton,
            })}
          />
        )
      }

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchQuery}
          onChange={handleChange}
          disabled={submitDisable}
        />
      </form>
    </header>
  );
};
