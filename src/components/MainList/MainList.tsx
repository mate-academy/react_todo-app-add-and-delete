import type { MainListType } from '../../types/MainListType';
import { MainItem } from '../MainItem/MainItem';

export const MainList = ({
  shownTodos,
  onUpdate,
  editFieldVal,
  onEditFieldVal,
  editInputVal,
  onEditInputVal,
  onEditHandle,
  onDelete,
  loadId,
  onLoadId,
  inputMainFocus,
  tempTodoItem,
}: MainListType) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {shownTodos.map(item => (
        <MainItem
          key={item.id}
          shownTodos={item}
          onUpdate={onUpdate}
          editFieldVal={editFieldVal}
          onEditFieldVal={onEditFieldVal}
          editInputVal={editInputVal}
          onEditInputVal={onEditInputVal}
          onEditHandle={onEditHandle}
          onDelete={onDelete}
          loadId={loadId}
          onLoadId={onLoadId}
          inputMainFocus={inputMainFocus}
        />
      ))}
      {tempTodoItem && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label ">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status "
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodoItem.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
