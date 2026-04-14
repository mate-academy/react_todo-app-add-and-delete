/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorState } from '../../types/ErrorState';
import { useEffect } from 'react';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => Promise<void>;
  onError: (error: ErrorState) => void;
  todosToDelete: number[] | null;
  newTodoField: React.RefObject<HTMLInputElement>;
}

export const TodoList = ({
  todos,
  tempTodo,
  onTodoDelete,
  onError,
  todosToDelete,
  newTodoField,
}: Props) => {
  useEffect(() => {
    newTodoField.current?.focus();
  }, [todos, newTodoField]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todoId={todo.id}
          title={todo.title}
          completed={todo.completed}
          onTodoDelete={onTodoDelete}
          onError={onError}
          todosToDelete={todosToDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todoId={tempTodo.id}
          title={tempTodo.title}
          completed={tempTodo.completed}
          onTodoDelete={onTodoDelete}
          onError={onError}
          todosToDelete={todosToDelete}
          tempTodo
        />
      )}

      {/* This is a completed todo */}
      {/*<div data-cy="Todo" className="todo completed">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*      checked*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  <span data-cy="TodoTitle" className="todo__title">*/}
      {/*    Completed Todo*/}
      {/*  </span>*/}

      {/*  /!* Remove button appears only on hover *!/*/}
      {/*  <button type="button" className="todo__remove" data-cy="TodoDelete">*/}
      {/*    ×*/}
      {/*  </button>*/}

      {/*  /!* overlay will cover the todo while it is being deleted or updated *!/*/}
      {/*  <div data-cy="TodoLoader" className="modal overlay">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* This todo is an active todo */}
      {/*<div data-cy="Todo" className="todo">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  <span data-cy="TodoTitle" className="todo__title">*/}
      {/*    Not Completed Todo*/}
      {/*  </span>*/}
      {/*  <button type="button" className="todo__remove" data-cy="TodoDelete">*/}
      {/*    ×*/}
      {/*  </button>*/}

      {/*  <div data-cy="TodoLoader" className="modal overlay">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* This todo is being edited */}
      {/*<div data-cy="Todo" className="todo">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  /!* This form is shown instead of the title and remove button *!/*/}
      {/*  <form>*/}
      {/*    <input*/}
      {/*      data-cy="TodoTitleField"*/}
      {/*      type="text"*/}
      {/*      className="todo__title-field"*/}
      {/*      placeholder="Empty todo will be deleted"*/}
      {/*      value="Todo is being edited now"*/}
      {/*    />*/}
      {/*  </form>*/}

      {/*  <div data-cy="TodoLoader" className="modal overlay">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* This todo is in loadind state */}
      {/*<div data-cy="Todo" className="todo">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  <span data-cy="TodoTitle" className="todo__title">*/}
      {/*    Todo is being saved now*/}
      {/*  </span>*/}

      {/*  <button type="button" className="todo__remove" data-cy="TodoDelete">*/}
      {/*    ×*/}
      {/*  </button>*/}

      {/*  /!* 'is-active' class puts this modal on top of the todo *!/*/}
      {/*  <div data-cy="TodoLoader" className="modal overlay is-active">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </section>
  );
};
