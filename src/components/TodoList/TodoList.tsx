import React, { memo, useCallback, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

import './TodoList.scss';

type Props = {
  todos: Todo[];
  onTodosChange: (newTodos: Todo[]) => void;
  loadingTodosIds?: number[];
  onTodoDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = memo(function TodoList({
  todos,
  onTodosChange,
  loadingTodosIds = [],
  onTodoDelete,
}) {
  const [editedTodoId] = useState<number | null>(null);

  const checkHandle = useCallback(
    (toggledTodo: Todo) => {
      const index = todos.findIndex(todo => todo.id === toggledTodo.id);

      const newTodos = [...todos];

      newTodos.splice(index, 1, toggledTodo);

      onTodosChange(newTodos);
    },
    [todos, onTodosChange],
  );

  return (
    <section className="TodoList" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onToggle={checkHandle}
              isTodoEdited={editedTodoId === todo.id}
              isTodoLoading={loadingTodosIds.includes(todo.id)}
              onDelete={onTodoDelete}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
});
