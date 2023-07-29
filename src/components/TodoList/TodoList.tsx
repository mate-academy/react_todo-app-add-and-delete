import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  todoItem: Todo | null;
  deletedId: number[] | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  todoItem,
  deletedId,
}) => {
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [selectedTodos, setSelectedTodos] = useState(deletedId);

  const handleDelete = (id: number) => {
    setSelectedTodo(id);
    deleteTodo(id)
      .finally(() => setSelectedTodo(0));
  };

  useEffect(() => {
    if (deletedId) {
      setSelectedTodos(deletedId);
      deletedId.forEach(id => {
        deleteTodo(id);
      });
    }
  }, [deletedId]);

  return (
    <section className="todoapp__main">
      {todos.map(({ completed, title, id }) => (
        <div
          key={id}
          className={classNames(
            'todo',
            { completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={completed}
            />
          </label>

          <span className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>

          <div className={classNames('modal', 'overlay', {
            'is-active': selectedTodos?.includes(id) || selectedTodo === id,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {todoItem && <TodoItem todo={todoItem} />}
    </section>
  );
};
