import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void,
  tempTodo: Todo | null
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <div
            data-cy="Todo"
            key={todo.id}
            className={cn('todo', { completed: todo.completed })}
          >
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
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>

          </div>
        );
      })}
      {tempTodo
              && (
                <div
                  data-cy="Todo"
                  className={cn('todo', { completed: tempTodo.completed })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={tempTodo.completed}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => deleteTodo(tempTodo.id)}
                  >
                    ×
                  </button>

                </div>
              )}
    </section>
  );
};
