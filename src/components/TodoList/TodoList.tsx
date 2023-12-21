import { FC } from 'react';
import { Todo } from '../Todo';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todos: TodoType[],
  tempTodo: Omit<TodoType, 'id'> | null,
  deleteTodo: (todoId: number) => void,
  showLoader: boolean,
}

export const TodoList: FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    deleteTodo,
    showLoader,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          showLoader={showLoader}
        />
      ))}

      {tempTodo && (
        <div
          className="todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">
            {tempTodo.title}
          </span>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
