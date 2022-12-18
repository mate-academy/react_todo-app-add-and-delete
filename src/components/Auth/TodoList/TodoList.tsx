import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  isProcessed: number[],
  isAdding: boolean,
  title: string,
};

export const TodoList: React.FC<Props> = (props) => {
  const { 
    todos,
    onDelete,
    isProcessed,
    isAdding,
    title,
  } = props;
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={isProcessed.includes(todo.id)}
        />
      ))}

      {isAdding && user && (
        <TodoItem
          todo={{
            id: 0,
            title,
            completed: false,
            userId: user?.id,
          }}
          onDelete={onDelete}
          isLoading
        />
      )}
    </section>
  );
};
