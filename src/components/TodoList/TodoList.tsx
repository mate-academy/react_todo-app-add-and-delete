/* eslint-disable jsx-a11y/label-has-associated-control */

import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredList: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[] | undefined>>;
  tempTodo: Omit<Todo, 'id'> | null;
  setError: (error: string) => void;
  deletingTodoIds: number[];
  setDeletingTodoIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  filteredList,
  setTodos,
  tempTodo,
  setError,
  deletingTodoIds,
  setDeletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          setError={setError}
          deletingTodoIds={deletingTodoIds}
          setDeletingTodoIds={setDeletingTodoIds}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
