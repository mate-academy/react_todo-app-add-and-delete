import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  changindIds: number[];
  onDeleteItem: (itemID: number) => void;
  onUpdate: () => void;
  tempTodo: null | Todo;
};

export const TodoList: React.FC<Props> = ({
  todos,
  changindIds,
  onDeleteItem,
  tempTodo: tempTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={changindIds.includes(todo.id)}
          onDelete={() => onDeleteItem(todo.id)}
        />
      ))}

      {tempTodoTitle && <TodoItem todo={tempTodoTitle} isProcessed={true} />}
    </section>
  );
};
