import { memo, FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './components/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIDs: number[];
  handleRemoveTodo: (todoId: number) => void;
}

export const TodoList: FC<Props> = memo(({
  todos,
  tempTodo,
  deletingTodoIDs,
  handleRemoveTodo,
}) => (
  <>
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        loading={deletingTodoIDs.includes(todo.id)}
        handleRemoveTodo={handleRemoveTodo}
      />
    ))}
    {tempTodo && <TodoItem loading todo={tempTodo} />}
  </>
));
