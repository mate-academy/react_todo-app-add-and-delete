import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import { TempTodo } from './TempTodo';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  haveId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onDeleteTodo: (todoId: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  haveId,
  setTodos,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          haveId={haveId}
          setTodos={setTodos}
          onDeleteTodo={onDeleteTodo}
        />
      ))}

      {tempTodo && (
        <div key="temp" className="temp-item">
          <TempTodo tempTitle={tempTodo.title} />
        </div>
      )}
    </section>
  );
};

export default TodoList;
