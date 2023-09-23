import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';
import { TContext, useTodoContext } from './TodoContext';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const {
    // todos,
    setTodos,
    // hasError,
    // setHasError,
    tempTodos,
  } = useTodoContext() as TContext;

  const USER_ID = 11550;

  const handleDelete = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => getTodos(USER_ID))
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        // console.error('Wystąpił błąd podczas dodawania zadania:', error);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map((todo, index) => {
        const isLastItem = index === todos.length - 1;

        return (
          <div data-cy="Todo" className={`${todo.completed ? 'todo completed' : 'todo'}`} key={todo.id}>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': ((tempTodos !== null)
                && isLastItem),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
