import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../Store/TodoContext';
import { deleteTodos, updateTodos } from '../../api/todos';
import { Error } from '../Error/ErrorMesage';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const { todos, setTodos, setErrorMessage } = useContext(TodoContext);
  const [handleDeleteTodoId, setHandleDeleteTodoId] = useState(0);
  const { completed, title } = todo;

  useEffect(() => {
    const todoInput = document.getElementById('todoInput');

    if ((handleDeleteTodoId || todo) && todoInput) {
      todoInput.focus();
    }
  }, [handleDeleteTodoId, todo]);

  const handleDelete = async (todoId: number) => {
    try {
      await setHandleDeleteTodoId(todoId);
      await deleteTodos(todoId);
      setTodos(currentTodos => currentTodos.filter(post => post.id !== todoId));
    } catch (error) {
      setErrorMessage(Error.delete);
    }
  };

  const updatedComplet = (post: Todo) => {
    const updatedTodo: Todo = {
      id: post.id,
      userId: 260,
      title: post.title.trim(),
      completed: !post.completed,
    };

    updateTodos(post.id, updatedTodo);
  };

  const handlerCompleted = () => {
    updatedComplet(todo);
    const updatedTodos = [...todos];
    const currentTodoIndex = updatedTodos.findIndex(
      (elem: Todo) => elem.id === todo.id,
    );

    if (currentTodoIndex !== -1) {
      const newCompelte = !updatedTodos[currentTodoIndex].completed;

      updatedTodos[currentTodoIndex] = {
        ...updatedTodos[currentTodoIndex],
        completed: newCompelte,
      };
      updatedTodos.splice(currentTodoIndex, 1, updatedTodos[currentTodoIndex]);

      setTodos(updatedTodos);
    }
  };

  return (
    /* This is a completed todo */
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={handlerCompleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title.trim()}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || handleDeleteTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
