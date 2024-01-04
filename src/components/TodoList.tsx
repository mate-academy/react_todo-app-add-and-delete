import { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Todo } from '../types';
import { deleteTodo } from '../api/todos';

interface Props {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    setTodos,
  } = props;

  const onTodoDelete = (id: number) => {
    deleteTodo(id);
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
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
            onClick={() => onTodoDelete(todo.id)}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
