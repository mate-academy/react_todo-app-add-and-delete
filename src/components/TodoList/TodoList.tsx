import { TodoInfo } from '../TodoInfo/TodoInfo';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodo: number[];

};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodo,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        key={todo.id}
        onDelete={onDelete}
        loadingTodo={loadingTodo}
      />
    ))}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        onDelete={onDelete}
        loadingTodo={loadingTodo}
      />
    )}
  </ul>
);
