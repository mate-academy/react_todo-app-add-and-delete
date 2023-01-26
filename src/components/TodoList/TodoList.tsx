import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  filtredTodos: Todo[],
  isTodoLoading: boolean,
  hendleRemoveTodo: (id: number) => void,
  isTodoRemove: boolean,
  tempTodo: Todo | null
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    filtredTodos,
    isTodoLoading,
    hendleRemoveTodo,
    isTodoRemove,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {filtredTodos.map(todoItem => (
          <TodoInfo
            todoList={todoItem}
            key={todoItem.id}
            isTodoLoading={isTodoLoading}
            hendleRemoveTodo={hendleRemoveTodo}
            isTodoRemove={isTodoRemove}
          />
        ))}
      </section>
    );
  },
);
