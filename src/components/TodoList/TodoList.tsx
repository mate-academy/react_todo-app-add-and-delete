/* eslint-disable no-console */
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteTodo } from '../../redux/todoThunks';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { setErrorType } from '../../redux/todoSlice';
import { ErrorType } from '../../types/errorType';

interface TodoListProps {
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  console.log('Rendering TodoList');

  const dispatch = useDispatch<AppDispatch>();
  const tempTodo = useSelector((state: RootState) => state.todos.tempTodo);
  const combinedTodos = tempTodo ? [...todos, tempTodo] : todos;
  const deletingTodoId = useSelector(
    (state: RootState) => state.todos.deletingTodoId,
  );

  const handleDeleteTodo = (todoId: number) => {
    dispatch(deleteTodo(todoId))
      .then(() => {
        // handle success if necessary
      })
      .catch((err: string) => {
        console.error('Unable to delete todo:', err);
        dispatch(setErrorType(ErrorType.DeleteTodoError));
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {combinedTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="temp-item"
            unmountOnExit={todo === tempTodo}
          >
            <TodoItem
              todo={todo}
              isTemporary={todo === tempTodo}
              onDelete={handleDeleteTodo}
              isDeleting={todo.id === deletingTodoId}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

    </section>
  );
};
