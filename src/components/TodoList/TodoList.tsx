import React, { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  modifyIds: number[];
  onRemoveTodo: (todoId: number) => void;
}

export const TodoList: FC<Props> = React.memo(function TodoList({
  todos,
  tempTodo,
  modifyIds,
  onRemoveTodo,
}) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition timeout={300} classNames="item" key={todo.id}>
            <TodoItem
              todo={todo}
              onRemove={onRemoveTodo}
              isLoading={modifyIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading />
          </CSSTransition>
        )}

        {/* Нижче код залишив на останнє завдання */}
        {/* This todo is an active todo */}
        {/* <div data-cy="Todo" className="todo">
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                      />
                    </label>
    
                    <span data-cy="TodoTitle" className="todo__title">
                      Not Completed Todo
                    </span>
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                    >
                      ×
                    </button>
    
                    <div data-cy="TodoLoader" className="modal overlay">
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  </div> */}

        {/* This todo is being edited */}
        {/* <div data-cy="Todo" className="todo">
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                      />
                    </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
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

        {/* This todo is in loadind state */}
        {/* <div data-cy="Todo" className="todo">
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                      />
                    </label>
    
                    <span data-cy="TodoTitle" className="todo__title">
                      Todo is being saved now
                    </span>
    
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                    >
                      ×
                    </button> */}

        {/* 'is-active' class puts this modal on top of the todo */}
        {/* <div data-cy="TodoLoader" className="modal overlay is-active">
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  </div> */}
      </TransitionGroup>
    </section>
  );
});
