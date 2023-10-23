import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  updateTodo: (updatedTodo: Todo) => void;
  isLoadingTodo: number[],
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoadingTodo,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteId={deleteTodo}
          updateTodo={updateTodo}
          isLoading={isLoadingTodo.includes(todo.id)}
          // значение isLoading вычисляется как булевое,
          // используя .includes(todo.id)
          // для проверки, содержит ли массив isLoading конкретный todo.id.
          // Если isLoading содержит todo.id, то условие в компоненте
          // TodoItem будет равно true, и индикатор загрузки будет активирован.
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteId={deleteTodo}
          updateTodo={updateTodo}
          isLoading={isLoadingTodo.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};
