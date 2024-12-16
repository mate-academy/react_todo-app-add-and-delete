import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as todosService from '../api/todos';

import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  changeComplete: (todo: Todo) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setIsDeleted: (isDeleted: boolean) => void;
  setErrorMessage: (error: string) => void;
  todosForDelete: Todo[];
};
export const TodoItem: React.FC<Props> = ({
  todo,
  changeComplete,
  setTodos,
  setIsDeleted,
  setErrorMessage,
  todosForDelete,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  function editTodo() {
    setValue(todo.title);
    setIsEdited(true);
  }

  const handleDeleteTodo = async (todoItem: Todo) => {
    setIsLoading(true);
    try {
      await todosService.deleteTodo(todoItem.id);
      setTodos(todosPrev =>
        todosPrev.filter(todoCurrent => todoCurrent.id !== todoItem.id),
      );
      setIsDeleted(true);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    todosForDelete.forEach((todoCurrent: Todo) =>
      handleDeleteTodo(todoCurrent),
    );
  }, [todosForDelete]);

  const handleSubmitEditedTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    todosService
      .editTodo({ ...todo, title: value })
      .then(todoRes => {
        setTodos(currenTodos => {
          const newTodos = [...currenTodos].map(todoCur =>
            todoCur.id === todo.id ? todoRes : todoCur,
          );

          return newTodos;
        });
      })
      .finally(() => setIsEdited(false));
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {' '}
        <input
          checked={todo.completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => changeComplete(todo)}
        />
      </label>

      {!isEdited && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={editTodo}
          >
            {todo.title}
          </span>

          <button
            onClick={() => handleDeleteTodo(todo)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            x
          </button>
        </>
      )}
      {isEdited && (
        <form onSubmit={handleSubmitEditedTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
