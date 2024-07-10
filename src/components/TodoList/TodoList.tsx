import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/Todo.context';
import { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { ErrorContext } from '../../context/Error.context';
import { deleteTodo } from '../../api/todos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  todos: Todo[];
}

export const TodoList: React.FC<Props> = ({ todos }) => {
  const {
    tempTodo,
    loadingIds,
    inputRef,
    onAddLoadingId,
    clearLoadingIds,
    onDeleteTodo,
  } = useContext(TodoContext);

  const { onError } = useContext(ErrorContext);

  const onDelete = async (id: number) => {
    try {
      onAddLoadingId(id);
      await deleteTodo(id);
      onDeleteTodo(id);
    } catch {
      onError('Unable to delete a todo');
    } finally {
      clearLoadingIds();
      inputRef.current?.focus();
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const isLoading = loadingIds.includes(todo.id);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={isLoading}
                onDelete={onDelete}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TodoItem todo={tempTodo} isLoading={true} />
          </CSSTransition>
        )}

        {/* This todo is being edited */}
        {/* <div data-cy="Todo" className="todo"> */}
        {/* <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
                </form> */}

        {/* <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div> */}
        {/* </div> */}
      </TransitionGroup>
    </section>
  );
};
