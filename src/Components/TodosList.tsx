import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  deleteTodo: (id: number) => void,
  loading: number[],
  tempTodo: Todo | null,
  updateTodo: (todo: Todo) => void,
}

export const TodosList: React.FC<Props> = ({
  todos,
  deleteTodo,
  loading,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isLoading={loading.includes(todo.id)}
          updateTodo={updateTodo}

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
          deleteTodo={deleteTodo}
          isLoading={loading.includes(tempTodo.id)}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};
