import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

import { updateTodo, getTodos, deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  isToggleClicked: boolean,
  isAdding: boolean,
  allTodos: Todo[],
  isClearButtonClicked: boolean,
  setNotification: React.Dispatch<React.SetStateAction<string>>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  isToggleClicked,
  isAdding,
  allTodos,
  isClearButtonClicked,
  setNotification,
}) => {
  const [cilckedTodo, setClickedTodo] = useState(0);
  const [temporaryTitle, setTemporaryTitle] = useState(todo.title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const changeTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (changeTodoInput.current) {
      changeTodoInput.current.focus();
    }
  });

  const isAnyChange = cilckedTodo === todo.id || isToggleClicked
    || (isClearButtonClicked && todo.completed)
    || (isAdding && allTodos[allTodos.length - 1] === todo)
    || isChanging;

  const handleCheckChange = async () => {
    setClickedTodo(todo.id);
    await updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .catch(() => {
        setNotification('Unable to update a todo');
      })
      .finally(() => setClickedTodo(0));

    await getTodos(todo.userId).then(setTodos);
  };

  const handleDeleteTodo = async () => {
    setClickedTodo(todo.id);
    await deleteTodo(todo.id)
      .catch(() => {
        setNotification('Unable to delete a todo');
      })
      .finally(() => setClickedTodo(0));

    await getTodos(todo.userId).then(setTodos);
  };

  const handleTitleChange = async (event: React.FormEvent, code?: string) => {
    event.preventDefault();

    if (todo.title === temporaryTitle || code === 'Escape') {
      setIsDoubleClicked(false);
      setIsChanging(false);

      return;
    }

    setIsChanging(true);
    await updateTodo(todo.id, {
      title: temporaryTitle,
    })
      .catch(() => {
        setNotification('Unable to update a todo');
      })
      .finally(() => {
        setIsDoubleClicked(false);
        setIsChanging(false);
        getTodos(todo.userId).then(setTodos);
      });

    await getTodos(todo.userId).then(setTodos);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckChange}
        />
      </label>

      {isDoubleClicked ? (
        <form
          onSubmit={handleTitleChange}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={temporaryTitle}
            ref={changeTodoInput}
            onChange={(e) => setTemporaryTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={(e) => {
              if (e.code === 'Escape') {
                handleTitleChange(e, e.code);
              }
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsDoubleClicked(true)}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isAnyChange,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
