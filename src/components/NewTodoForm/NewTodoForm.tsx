import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import * as todoService from '../../api/todos';
import { ErrorMessages, Todo } from '../../types/Todo';
import { useTodos } from '../../utils/hooks';

interface Props {
  onTodoCreated: (todo: Todo) => void;
}

export type TodoCreateData = {
  title: string;
};

export const NewTodoForm: React.FC<Props> = ({ onTodoCreated }) => {
  const { setError, displayError, isLoading, setIsLoading, setTempTodo } =
    useTodos();
  const [title, setTitle] = useState('');

  const newTodo = {
    userId: todoService.USER_ID,
    title: title.trim(),
    completed: false,
  };

  const titleField = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      displayError(ErrorMessages.TitleIsEmpty);

      return;
    }

    setTempTodo({
      id: 0,
      ...newTodo,
    });
    setIsLoading(true);
    todoService
      .createTodo(newTodo)
      .then(newAddedTodo => {
        onTodoCreated(newAddedTodo);
        setTitle('');
        setIsLoading(false);
      })
      .catch(() => {
        displayError(ErrorMessages.AddTodo);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    setError(null);
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [setError]);

  useEffect(() => {
    if (!isLoading) {
      titleField?.current?.focus();
    }
  }, [isLoading]);

  return (
    <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
      <input
        disabled={isLoading}
        ref={titleField}
        data-cy="NewTodoField"
        type="text"
        value={title}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleChange}
      />
    </form>
  );
};
