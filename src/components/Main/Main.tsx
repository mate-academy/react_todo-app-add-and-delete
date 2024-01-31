import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { ErrorType } from '../../types/type';

type Props = {
  posts: Todo[];
  setPosts: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  resetError: () => void;
};

export const Main: React.FC<Props> = ({
  posts, setPosts, setError, resetError,
}) => {
  const handleDeletePost = (id: number) => {
    setPosts(currentPosts => currentPosts.filter(post => id !== post.id));

    return deleteTodos(id)
      .catch((error) => {
        setPosts(posts);
        setError((prevState: ErrorType) => ({
          ...prevState,
          deleteTodo: true,
        }));
        resetError();
        throw error;
      });
  };

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">

        {posts.map((todo: Todo) => {
          const { id, completed, title } = todo;

          return (
            <div
              key={id}
              data-cy="Todo"
              className={classNames({
                todo: !completed,
                'todo completed': completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={() => { }}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeletePost(id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};
