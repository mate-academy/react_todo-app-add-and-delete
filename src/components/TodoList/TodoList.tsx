import { CustomTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import TodoComponent from '../Todo/Todo';

type Props = {
  todos: Todo[];
  customTodo: CustomTodo | null;
  onDeleteTodo: (todoId: number) => void;
  isDeleting: boolean;
  deletingCompleted: boolean;
};

const TodoList: React.FC<Props> = ({
  todos, customTodo, onDeleteTodo, isDeleting, deletingCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(
        todo => (
          <TodoComponent
            todo={todo}
            key={todo.id}
            spinner={false}
            onDeleteTodo={onDeleteTodo}
            isDeleting={isDeleting}
            deletingCompleted={deletingCompleted}
          />
        ),
      )}
      {customTodo && (
        <TodoComponent
          todo={{ ...customTodo, id: 0 }}
          key={customTodo.title}
          spinner
          onDeleteTodo={onDeleteTodo}
          isDeleting={isDeleting}
          deletingCompleted={deletingCompleted}
        />
      )}
    </section>
  );
};

export default TodoList;
