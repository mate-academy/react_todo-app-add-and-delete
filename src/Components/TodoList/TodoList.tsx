import { TodoItem } from '../Todo/TodoItem';

import { Todo } from '../../types/Todo';

type TodoListProps = {
  todos: Todo[];
  filter: string;
  handleDelete: (id: number) => void;
  tempTodo: Todo | null;
  todoToBeDeleted: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  handleDelete,
  tempTodo,
  todoToBeDeleted,
}) => {
  const isTodoTemp = tempTodo !== null;
  const findVisibleTodos = () => {
    switch (filter) {
      case 'all':
        return todos;
      case 'active':
        return todos?.filter(todo => !todo.completed);
      case 'completed':
        return todos?.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const visibleTodos = findVisibleTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos?.map(todo => (
        <TodoItem
          handleDelete={handleDelete}
          key={todo.id}
          todo={todo}
          todoToBeDeleted={todoToBeDeleted}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isTemp={isTodoTemp} />}
    </section>
  );
};
