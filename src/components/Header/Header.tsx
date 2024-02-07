import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext, TodosUpdateContext } from '../../contexts/TodosProvider';
import { USER_ID } from '../../constants/USER_ID';

interface Props {
  setTempTodo: (_todo: Todo | null) => void,
  tempTodo: Todo | null,
  setErrorMessage: (errorMessage: string) => void,
}

export const Header: React.FC<Props> = ({
  setTempTodo,
  tempTodo,
  setErrorMessage,
}) => {
  const { todos } = useContext(TodosContext);
  const { toggleAll, addTodo } = useContext(TodosUpdateContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const newTodoInput = useRef<HTMLInputElement>(null);

  const isAllCompleted = todos.every(({ completed }) => completed);

  const handleToggleAllChanged = () => {
    toggleAll(isAllCompleted);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = newTodoTitle.trim();

    if (normalizedTitle) {
      const newTodo: Todo = {
        title: normalizedTitle,
        userId: USER_ID,
        id: 0,
        completed: false,
      };

      setTempTodo(newTodo);

      addTodo(newTodo)
        .then(() => {
          setNewTodoTitle('');
        })
        .finally(() => {
          setTempTodo(null);
          setTimeout(() => {
            newTodoInput.current?.focus();
          }, 5);
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [todos.length]);

  return (
    <header className="todoapp__header">
      {!!todos.length
        && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            onClick={handleToggleAllChanged}
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
          />
        )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoInput}
          disabled={!!tempTodo}
          value={newTodoTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
