import { Todo } from '../types/Todo';
import { TodoItems } from './TodoItems';
import { ErrorMessage } from './errorsMessage';
type Props = {
  posts: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  todoTemplate: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  posts,
  todoTemplate,
  setTodos,
  setErrorMessage,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {posts.map(post => (
      <TodoItems
        todoTemplate={todoTemplate}
        key={post.id}
        id={post.id}
        completed={post.completed}
        title={post.title}
        setTodos={setTodos}
        setErrorMessage={setErrorMessage}
      />
    ))}
  </section>
);
