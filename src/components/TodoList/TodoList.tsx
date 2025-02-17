import { useContext } from 'react';
import { getVisibleTodos } from '../../utils/getVisibleTodos';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../todosContext';

export const TodoList: React.FC = () => {
  const { todos, status, tempTodo } = useContext(TodosContext);

  const visibleTodos = getVisibleTodos(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} />}
    </section>
  );
};
