import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (deletedPostId: number) => void;
  selectedTodo: number;
  setSelectedTodo: React.Dispatch<React.SetStateAction<number>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  selectedTodo,
  setSelectedTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const { id, completed, title } = todo;

        return (
          <TodoItem
            id={id}
            completed={completed}
            title={title}
            deleteTodo={deleteTodo}
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
            key={id}
          />
        );
      })}
    </section>
  );
};
