import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { todosApi } from '../api/todos-api';
import { useTodoContext } from '../context/todoContext/useTodoContext';
import { useErrorContext } from '../context/errorContext/useErrorContext';

interface TodoContentMainProps {
  todos: Todo[],
  tempTodo: Todo | null,
}

export const TodoContentMain: FC<TodoContentMainProps> = (props) => {
  const { todos, tempTodo } = props;
  const {
    removeTodo,
    setRemovingTodoIds,
    removingTodoIds,
  } = useTodoContext();
  const { notifyAboutError } = useErrorContext();
  const onRemove = async (id: number) => {
    setRemovingTodoIds([id]);
    try {
      const result = await todosApi.remove(id) as number;

      if (result) {
        removeTodo(id);
      }
    } catch {
      notifyAboutError('Unable to delete a todo');
    } finally {
      setRemovingTodoIds([]);
    }
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemove(todo.id)}
          >
            ×
          </button>

          <div
            className={classNames(
              'modal',
              'overlay',
              {
                'is-active': removingTodoIds.includes(todo.id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <article>
          <div
            className={classNames(
              'todo',
              {
                completed: tempTodo.completed,
              },
            )}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">{tempTodo.title}</span>

            <div
              className={classNames(
                'modal',
                'overlay',
                {
                  'is-active': true,
                },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </article>
      )}
    </section>
  );
};
