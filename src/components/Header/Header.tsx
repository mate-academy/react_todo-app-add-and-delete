import classNames from 'classnames';
import React, { useState } from 'react';
import { addTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';

type Props = {
  count: number;
  isActiveCount: number,
  userId: number,
  fetchTodos: (userId: number) => void,
  changeHasError: (typeError: ErrorType) => void,
  changeIsError: () => void,
  addTempTodo: (todo: Todo | null) => void,
};

export const Header: React.FC<Props> = ({
  count,
  isActiveCount,
  userId,
  fetchTodos,
  changeHasError,
  changeIsError,
  addTempTodo,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const fetchNewTodo = async (title: string, id: number) => {
    if (!titleTodo) {
      changeHasError(ErrorType.TITLE_ERROR);
      changeIsError();

      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId: id,
      completed: false,
    };

    try {
      addTempTodo(newTodo);
      await addTodo(newTodo);

      await fetchTodos(userId);
      await setIsAdded(false);
    } catch {
      changeHasError(ErrorType.ADD_ERROR);
      changeIsError();
    } finally {
      addTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {count > 0 && (
        <button
          aria-label="complited todo"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !isActiveCount,
          })}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setIsAdded(true);
          fetchNewTodo(titleTodo, userId);
          setTitleTodo('');
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={(event) => {
            setTitleTodo(event.target.value);
          }}
          disabled={isAdded}
        />
      </form>
    </header>
  );
};
