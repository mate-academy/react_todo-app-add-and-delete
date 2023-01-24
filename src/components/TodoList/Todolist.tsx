import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[] | [];
  onDeleteItem: (todoId: number) => void
}

export const TodoList: FC<Props> = memo(
  ({ todos, onDeleteItem }) => {
    return (
      <section
        className="todoapp__main"
        data-cy="TodoList"
      >
        {todos.map(todo => (

          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </section>
    );
  },
);
