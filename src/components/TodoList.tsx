import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo: (todoId: number) => Promise<void>,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({ todos, deleteTodo, tempTodo }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={deleteTodo}
        />
      ))}

      {tempTodo && (
        <div
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
        >
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
