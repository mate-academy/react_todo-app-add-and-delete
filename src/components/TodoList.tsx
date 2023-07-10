import { useTodoContext } from '../hooks/useTodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const {
    todos,
    tempTodo,
    processed,
  } = useTodoContext();

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onProcessed={processed.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} onProcessed />}
    </section>
  );
};

export default TodoList;
