import React, { useState, useEffect } from 'react';

import { ErrorsEnum } from '../../enums/ErrorMessage';

import cn from 'classnames';

import { Todo } from '../../types/Todo';

import { USER_ID, createTodo } from '../../api/todos';

const createNewTodo = (title: string): Omit<Todo, 'id'> => {
  return { title, completed: false, userId: USER_ID };
};

type Props = {
  onAddTodo: (todo: Todo) => void;
  onTempTodoChange: (todo: Todo | null) => void;
  onError: (message: string) => void;
  onClearError: () => void;
  hasTodos: boolean;
  isAllTodoCompleted: boolean;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
};

const TodoFormComponent = ({
  onAddTodo,
  onTempTodoChange,
  onError,
  onClearError,
  hasTodos,
  isAllTodoCompleted,
  newTodoInputRef,
}: Props) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  // const inputNewTodoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isSubmiting) {
      newTodoInputRef.current?.focus();
    }
  }, [isSubmiting, newTodoInputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClearError();

    const trimedTitle = title.trim();

    if (!trimedTitle) {
      onError(ErrorsEnum.TITLE);

      return;
    }

    setIsSubmiting(true);

    const newTodo = createNewTodo(trimedTitle);

    onTempTodoChange({ ...newTodo, id: 0 });

    createTodo(newTodo)
      .then(todo => {
        onAddTodo(todo);
        setTitle('');
      })

      .catch(() => {
        onError(ErrorsEnum.ADD);
      })

      .finally(() => {
        setIsSubmiting(false);
        onTempTodoChange(null);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', isAllTodoCompleted && 'active')}
          data-cy="ToggleAllButton"
        />
      )}

      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={newTodoInputRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isSubmiting}
      />
    </form>
  );
};

export const TodoForm = React.memo(TodoFormComponent);
