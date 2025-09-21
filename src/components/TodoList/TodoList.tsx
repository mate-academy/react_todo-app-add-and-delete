import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  tasks: Todo[] | null;
  onDelete: (id: number) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tasks &&
        tasks.map(task => (
          <TodoItem key={task.id} todo={task} onDelete={onDelete} />
        ))}
    </section>
  );
};

export default React.memo(TodoList);
