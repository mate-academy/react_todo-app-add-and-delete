import React from 'react';
import { Todo } from '../types/Todo';
import ToDoItem from './ToDoItem'; // Импортируем ToDoItem
import TempTodo from './TempTodo';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  tempTodo?: Todo | null;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <ToDoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

export default TodoList;
