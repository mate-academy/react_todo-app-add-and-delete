import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

type Props = {
  todosLength: number
  setError: (error: string) => void,
  user: User | null,
  onAdd: (todo: Todo) => void,
  isAdding: boolean,
  setIsAdding: (b: boolean) => void,
  setNewTodoTitle: (title: string) => void,
  allCompleted: boolean,
  onCompleteAll: () => void
};

export const Header: React.FC<Props> = ({
  todosLength,
  setError,
  user,
  onAdd,
  isAdding,
  setIsAdding,
  setNewTodoTitle,
  allCompleted,
  onCompleteAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [titleValue, setTitleValue] = useState('');

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!titleValue) {
      setError('Title can\'t be empty');

      return;
    }

    if (user) {
      setNewTodoTitle(titleValue);

      setTitleValue('');

      const newTodo = {
        id: 0,
        userId: user.id,
        title: titleValue,
        completed: false,
      };

      try {
        setIsAdding(true);
        const response = await addTodo(user.id, newTodo);
        const {
          id,
          userId,
          title,
          completed,
        } = response;

        const todo = {
          id,
          userId,
          title,
          completed,
        };

        onAdd(todo);
      } catch {
        setError('Unable to add a todo');
      }
    }

    setIsAdding(false);
    setNewTodoTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todosLength !== 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          aria-label="toogle all"
          onClick={() => onCompleteAll()}
        />
      )}

      <form onSubmit={onSubmitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleValue}
          onChange={(event) => setTitleValue(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
