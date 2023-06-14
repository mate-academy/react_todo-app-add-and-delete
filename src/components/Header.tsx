import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import classNames from 'classnames';
import { ErrorTypes, USER_ID } from '../constants';
import { Todo } from '../types/Todo';
import { addTodo } from '../api/todos';

type Props = {
  hasActive: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
};

export const Header: React.FC<Props> = ({
  setTodos,
  hasActive,
  setTempTodo,
  setErrorType,
}) => {
  const [title, setTitle] = useState('');
  const [isTodoAdding, setIsTodoAdding] = useState(false);

  const addTodoToServer = useCallback(async () => {
    const newTodoToFetch = {
      title,
      completed: false,
      userId: USER_ID,
    };

    const currentTempTodo = {
      ...newTodoToFetch,
      id: 0,
    };

    setTempTodo(currentTempTodo);
    setIsTodoAdding(true);

    try {
      const addedTodo = await addTodo(newTodoToFetch);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (error) {
      setErrorType(ErrorTypes.ADD);
    } finally {
      setIsTodoAdding(false);
      setTempTodo(null);
    }
  }, [title]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorType('empty title');

      return;
    }

    setTitle('');
    addTodoToServer();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="toggle all todos statuses"
        className={classNames('todoapp__toggle-all', {
          active: hasActive,
        })}
        disabled={!hasActive}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
};
