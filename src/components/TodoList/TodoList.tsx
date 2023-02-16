/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TemporaryTodo } from '../TemporaryTodo/TemporaryTodo';

type Props = {
  removeTodo: (todoId: number) => void,
  tempTodo: unknown,
  todoTitle: string,
  todos: Todo[],
  todoIdsToRemove: number[],
  setTodoIdsToRemove: (n: number[]) => void,
};

export const TodoList: React.FC<Props> = ({
  removeTodo,
  tempTodo,
  todoTitle,
  todos,
  todoIdsToRemove,
  setTodoIdsToRemove,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        todo.completed ? (
          <div key={todo.id} className="todo completed">
            <label className="todo__status-label">
              <input
                title="status"
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                setTodoIdsToRemove([...todoIdsToRemove, todo.id]);
                removeTodo(todo.id);
              }}
            >
              x
            </button>

            <div className={classNames(
              'modal overlay',
              { 'is-active': todoIdsToRemove.includes(todo.id) },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ) : (
          <div key={todo.id} className="todo">
            <label className="todo__status-label">
              <input
                title="status"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">{todo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                setTodoIdsToRemove([...todoIdsToRemove, todo.id]);
                removeTodo(todo.id);
              }}
            >
              x
            </button>

            <div className={classNames(
              'modal overlay',
              { 'is-active': todoIdsToRemove.includes(todo.id) },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )
      ))}

      {tempTodo !== null && <TemporaryTodo title={todoTitle} />}
    </section>
  );
};
