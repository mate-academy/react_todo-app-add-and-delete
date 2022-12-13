import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  visibleTodos: Todo[] | null,
  isAdding: boolean,
  currentInput: string,
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    visibleTodos,
    isAdding,
    currentInput,
  } = props;

  return (
    <>
      <section
        className="todoapp__main"
        data-cy="TodoList"
      >
        {visibleTodos?.map((todo: Todo) => (
          <TodoInfo key={todo.id} todo={todo} />
        ))}
        {isAdding && (
          <div
            className="todo"
            key={0}
          >
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {currentInput}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>
          </div>
        )}

      </section>

    </>
  );
};
