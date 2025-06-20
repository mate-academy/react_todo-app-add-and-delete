/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: Todo['id']) => void;
  handleActiveTodo: (todoId: Todo['id']) => void;
  activeTodo: Todo[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deleteTodo,
  handleActiveTodo,
  activeTodo,
}) => {
  return (
    <section className={classNames('todoapp__main')} data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          handleActiveTodo={handleActiveTodo}
          activeTodo={activeTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={() => {}}
          handleActiveTodo={() => {}}
        />
      )}
    </section>
  );
};
