import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoItem } from '../TodoItem/TodoItem';
import { useState } from 'react';

interface Props {
  todos: Todo[];
  loader: boolean;
  tempTodo: Todo | null;
  deletePosts: (b: Todo) => void;
  clearTodos: number[];
}

export const Main = ({
  todos,
  loader,
  tempTodo,
  deletePosts,
  clearTodos,
}: Props) => {
  const [deleteTodoId, setDeleteTodoId] = useState<number>();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos &&
        todos.length > 0 &&
        todos.map(todo => (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label
              className="todo__status-label"
              aria-labelledby={`todo_${todo.id}`}
            >
              <input
                id={`todo_${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                deletePosts(todo);
                setDeleteTodoId(todo.id);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active':
                  (loader && todo.id === 0) ||
                  todo.id === deleteTodoId ||
                  clearTodos.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

      <TodoItem tempTodo={tempTodo} loader={loader} />
    </section>
  );
};
