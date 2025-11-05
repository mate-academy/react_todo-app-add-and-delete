import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import cn from 'classnames';

interface Props {
  todos: Todo[];
  loading: boolean;
  selected: number | null;
  handleDoubleClick: (todo: Todo) => void;
  isSubmitting: boolean;
  selectedTitle: string;
  setSelectedTitle: (title: string) => void;
  deleteTodoHandler: (id: number) => void;
  deletingTodosId: number[];
}

export const TodoList = ({
  todos,
  loading,
  selected,
  handleDoubleClick,
  isSubmitting,
  selectedTitle,
  setSelectedTitle,
  deleteTodoHandler,
  deletingTodosId,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            selected={selected}
            handleDoubleClick={handleDoubleClick}
            selectedTitle={selectedTitle}
            setSelectedTitle={setSelectedTitle}
            isSubmitting={isSubmitting}
            deleteTodoHandler={deleteTodoHandler}
            deletingTodosId={deletingTodosId}
          ></TodoItem>
        );
      })}

      {/* <div data-cy="Todo" className="todo">
            <label htmlFor="todo-placeholder-status" className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                id="todo-placeholder-status"
              />
            </label>
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

      {/* This todo is in loading state */}
      {/* <div data-cy="Todo" className="todo">
            <label htmlFor="todo-placeholder-status" className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                id="todo-placeholder-status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button
              disabled={isSubmitting}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>

            {/* 'is-active' class puts this modal on top of the todo
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />

              {loading && <div className="loader" />}
            </div>
          </div> */}
    </section>
  );
};
