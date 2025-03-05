import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItems';
import classNames from 'classnames';

type TodoListProps = {
  filteredTodos: Todo[];
  onDelete: (id: Todo['id']) => void;
  onToggle: (id: number) => void;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  onDelete,
  onToggle,
  tempTodo,
  deletingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        onToggle={onToggle}
        isDeleting={deletingTodoIds.includes(todo.id)}
      />
    ))}
    {tempTodo && (
      <div data-cy="TempTodo">
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          onToggle={() => {}}
          isTemporary={true}
        />
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay is-active')}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
