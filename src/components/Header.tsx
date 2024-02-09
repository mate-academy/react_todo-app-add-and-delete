import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { TodoContext } from '../contexts/TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { createTodo, updateTodos } from '../api/todos';
import { USER_ID } from '../utils/constants';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const {
    todos,
    setErrorMessage,
    setTodos,
    setTempTodo,
    idsToUpdate,
    updateTodoList,
  } = useContext(TodoContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllTodoCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const tempTodo: Todo = {
      title: query.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    if (query.trim().length === 0) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      inputRef.current?.focus();

      return;
    }

    setTempTodo(tempTodo);

    inputRef.current?.setAttribute('disabled', 'true');

    createTodo(tempTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.FailedAddTodo);
      })
      .finally(() => {
        setTempTodo(null);
        inputRef.current?.removeAttribute('disabled');
        inputRef.current?.focus();
      });
  };

  const HandleCheckAll = () => {
    setErrorMessage('');

    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);
    const todosOnStatusUpdate = !isAllTodoCompleted
      ? activeTodos
      : completedTodos;

    todosOnStatusUpdate.forEach(({ title, completed, id }) => {
      idsToUpdate(id);

      updateTodos({ title, completed: !completed, id })
        .then(() => updateTodoList({ title, completed: !completed, id }))
        .catch(() => setErrorMessage(ErrorMessage.FailedUpdateTodo))
        .finally(() => idsToUpdate(null));
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: isAllTodoCompleted,
            },
          )}
          data-cy="ToggleAllButton"
          onClick={HandleCheckAll}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          name="newTodoName"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoComplete="off"
          value={query}
          ref={inputRef}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </header>
  );
};
