import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  setTodoList: (todos: Todo[]) => void;
  todos: Todo[];
  setErrorMessage: (value: string) => void;
  deletedTodos: number[];
  setDeletedTodos: (value: number[]) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodoList,
  setErrorMessage,
  deletedTodos,
  setDeletedTodos,
  tempTodo,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <div
        className={classNames('todo', {
          completed: todo.completed,
        })}
        key={todo.id}
      >
        <TodoInfo
          setTodoList={setTodoList}
          todo={todo}
          todos={todos}
          setErrorMessage={setErrorMessage}
          deletedTodos={deletedTodos}
          setDeletedTodos={setDeletedTodos}
        />
      </div>
    ))}
    {tempTodo && (
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">{tempTodo.title}</span>
        <button type="button" className="todo__remove">
          ×
        </button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
