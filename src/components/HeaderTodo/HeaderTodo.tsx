import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import React from 'react';
import { errorNotification } from '../../constants/errors';
import { addTodos, USER_ID } from '../../api/todos';
import { focusTodoInput } from '../../helpers/inputFocus';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  setIsTempTodoCreating: (isCreating: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
  isTempTodoCreating: boolean;
}

export const HeaderTodo: FC<Props> = ({
  todos,
  setErrorMessage,
  setTodos,
  setIsTempTodoCreating,
  setTempTodo,
  isTempTodoCreating,
}: Props) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  const areAllTodosActive = todos.every(todo => todo.completed);
  const [title, setTitle] = useState('');

  useEffect(() => {
    // inputRef.current?.focus();
    focusTodoInput();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTitle(event.target.value);
  };

  const handleCreation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clearTitle = title.trim();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: clearTitle,
      completed: false,
    };

    if (!clearTitle) {
      setErrorMessage(errorNotification.title);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setTempTodo(newTodo);
    setIsTempTodoCreating(true);
    addTodos(newTodo)
      .then(createdTodo => {
        setTodos((prev: Todo[]) => [...prev, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(errorNotification.add);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsTempTodoCreating(false);
        setTimeout(() => focusTodoInput(), 0);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllTodosActive,
        })}
        data-cy="ToggleAllButton"
        disabled={isTempTodoCreating}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleCreation}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={handleInputChange}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          // ref={inputRef}
          disabled={isTempTodoCreating}
        />
      </form>
    </header>
  );
};
