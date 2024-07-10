import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem';
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedTodo: number;
  doneTask: boolean;
  onDeleteTodo: (val: number) => void;
  onSelectedTodo: (val: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedTodo,
  doneTask,
  onDeleteTodo,
  onSelectedTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          selectedTodo={selectedTodo}
          doneTask={doneTask}
          onDeleteTodo={onDeleteTodo}
          onSelectedTodo={onSelectedTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          selectedTodo={selectedTodo}
          doneTask={doneTask}
          onDeleteTodo={onDeleteTodo}
          onSelectedTodo={onSelectedTodo}
        />
      )}
    </section>
  );
};
