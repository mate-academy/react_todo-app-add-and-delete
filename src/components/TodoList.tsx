import { useContext, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TodoContext } from '../contexts/TodoContext';
import { Filters } from '../types/Filters';

export const TodoList: React.FC = () => {
  const {
    todos,
    filter,
    tempTodo,
  } = useContext(TodoContext);

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    switch (filter) {
      case Filters.Completed:
        return todo.completed;
      case Filters.Active:
        return !todo.completed;
      default:
        return todo;
    }
  }), [todos, filter]);

  return (
    <section className="todoapp__main">
      {filteredTodos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isCreating />
      )}
    </section>
  );
};
