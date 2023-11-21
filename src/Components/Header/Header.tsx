import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { postTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { USER_ID } from '../../utils/userId';
import { TodosContext } from '../GlobalStateProvier';

export const Header: React.FC = () => {
  const {
    setError, setTodos, setTempTodo, todos,
  } = useContext(TodosContext);

  const newTodoInput = useRef<HTMLInputElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const active = todos.filter(todo => !todo.completed);

  useEffect(() => {
    if (newTodoInput.current) {
      newTodoInput.current.focus();
    }
  });

  // eslint-disable-next-line consistent-return
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setInputDisabled(true);

    if (!newTodoTitle.trim()) {
      setNewTodoTitle('');
      setInputDisabled(false);

      return setError(Errors.TitleError);
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    postTodo(USER_ID, newTempTodo)
      .then(response => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, response] as Todo[]);
        setNewTodoTitle('');
      })
      .catch(() => setError(Errors.AddError))
      .finally(() => {
        setTempTodo(null);
        setInputDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      {active.length > 0 && (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={newTodoInput}
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
