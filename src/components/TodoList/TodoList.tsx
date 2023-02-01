import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  filtredTodos: Todo[],
  isTodoLoading: boolean,
  deletedTodosId: number[],
  tempTodo: Todo | null,
  activeTodoId: number[],
  onDelete: (id: number) => void
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    filtredTodos,
    isTodoLoading,
    onDelete,
    deletedTodosId,
    tempTodo,
    activeTodoId,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {filtredTodos.map(todoItem => (
          <TodoInfo
            todoList={todoItem}
            key={todoItem.id}
            onDelete={onDelete}
            deletedTodosId={deletedTodosId}
            isTodoLoading={isTodoLoading}
            activeTodoId={activeTodoId}
          />
        ))}

        {isTodoLoading && tempTodo && (
          <TodoInfo
            todoList={tempTodo}
            key={tempTodo.id}
            onDelete={onDelete}
            deletedTodosId={deletedTodosId}
            isTodoLoading={isTodoLoading}
            activeTodoId={activeTodoId}
          />
        )}
      </section>
    );
  },
);
