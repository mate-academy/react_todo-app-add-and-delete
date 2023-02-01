import { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  todos: Todo[],
  isActive: boolean,
  handleDeleteClick: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const { todos, isActive, handleDeleteClick } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          todo={todo}
          isActive={isActive}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
    </section>
  );
});
