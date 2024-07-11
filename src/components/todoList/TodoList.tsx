import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'gi';

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
          key={uuidv4()}
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
