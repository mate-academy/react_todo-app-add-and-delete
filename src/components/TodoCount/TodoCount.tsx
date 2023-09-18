import { useTodo } from '../../provider/todoProvider';

export const TodoCount = () => {
  const { todos } = useTodo();
  const todosLeft = todos.filter(todo => !todo.completed);

  return (
    <span className="todo-count">
      {todosLeft.length}
      {' '}
      {todosLeft.length === 1 ? 'item' : 'items'}
      {' '}
      left
    </span>

  );
};
