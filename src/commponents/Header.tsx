import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

interface Props {
  setErrorType: (errorMessage: string) => void;
  todoTask: string;
  onChangeTodoTask: (value: string) => void;
  newTodo: Todo | null;
  deleteItemTodo: number;
  loadedDelete: boolean;
  addNewTodo: (todoToAdd: Todo) => void;
  lengthOfTodo: number;
}

export const Header: React.FC<Props> = props => {
  const {
    setErrorType,
    todoTask,
    onChangeTodoTask,
    newTodo,
    deleteItemTodo,
    loadedDelete,
    addNewTodo,
    lengthOfTodo,
  } = props;

  const todoUseRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      todoUseRef.current &&
      newTodo === null &&
      Object.is(deleteItemTodo, NaN) &&
      loadedDelete === false
    ) {
      todoUseRef.current.focus();
    }
  }, [newTodo, deleteItemTodo, loadedDelete, lengthOfTodo]);

  const onSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (!todoTask.trim()) {
      setErrorType('Title should not be empty');

      return;
    }

    const itemTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todoTask.trim(),
      completed: false,
    };

    addNewTodo(itemTodo);
  };

  return (
    <>
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={onSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTask}
            onChange={event => onChangeTodoTask(event.target.value)}
            ref={todoUseRef}
            disabled={Boolean(newTodo)}
          />
        </form>
      </header>
    </>
  );
};
