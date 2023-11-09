/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';

import { Error } from '../../types/Error';
import { addTodo } from '../../api/todos';
import { GlobalContext } from '../../providers/GlobalContext';
import { Todo } from '../../types/Todo';

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    USER_ID,
    todos,
    setTodos,
    // filter,
    // setFilter,
    // filteredTodos,
    // setFilteredTodos,
    // error,
    setError,
    inputRef,
    // tempTodo,
    setTempTodo,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isDisabled]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      try {
        setIsDisabled(true);
        const response = await addTodo(newTodo);

        setTodos((prev) => [...prev, response] as Todo[]);
      } catch (err) {
        setError(Error.Add);
        setTodos(todos);
      } finally {
        setTitle('');
        setTempTodo(null);
        setIsDisabled(false);
      }
    } else {
      setError(Error.Title);
      setTitle('');
    }
  };

  const isAllCompleted = todos.some(todo => !todo.completed);

  // const handleToggleAll = (event) => {
  //   event.preventDefault();
  // };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllCompleted },
          )}
          data-cy="ToggleAllButton"
        // onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleCreate}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
