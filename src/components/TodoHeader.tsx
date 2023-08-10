/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import cn from 'classnames';
import { Error } from '../utils/Enum';
import { Todo } from '../types/Todo';
import { USER_ID, createTodo } from '../api/todos';

type Props = {
  activeButton: boolean,
  setNewTodo: (todo: Todo | null) => void,
  setHasError: (value: Error) => void,
  setTodos: (array: Todo[]) => void,
  todos: Todo[]
};

export const TodoHeader: React.FC<Props> = ({
  activeButton,
  setNewTodo,
  setHasError,
  setTodos,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const addedTodo = (task: string) => {
    const newTask: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: task,
      completed: false,
    };

    setNewTodo({ ...newTask, id: 0 });
    setTitle('');

    createTodo(newTask)
      .then(actualTodo => {
        // const currentTodos = [...todos, actualTodo];

        setTodos([...todos, actualTodo]);
        setIsAdded(false);
      })
      .catch(() => setHasError(Error.ADD))
      .finally(() => setNewTodo(null));
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsAdded(true);

      if (title === '') {
        setHasError(Error.TITLE);
      } else {
        addedTodo(title);
      }
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: activeButton })}
      />

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={handleEnter}
          disabled={isAdded}
        />
      </form>
    </header>
  );
};
