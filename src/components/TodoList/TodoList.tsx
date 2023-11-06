import TodoItem from './TodoItem';
import { Todo } from '../../types/Todo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoId: number[];
  removeTodo: (itemId: number) => void;
  updateTodo: (itemId: number, completed: boolean) => void;
};

export const TodoList = ({
  todos, removeTodo, updateTodo, tempTodo, loadingTodoId,
}: TodoListProps) => {
  return (
    <TransitionGroup>

      {todos.map(todo => (
        <CSSTransition
        key={todo.id}
        timeout={300}
        classNames="item"
      >
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          isLoading={loadingTodoId.includes(todo.id)}
          updateTodo={updateTodo}
        />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
        key={0}
        timeout={300}
        classNames="temp-item"
      >
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          isLoading
        />
        </CSSTransition>
      )}

    </TransitionGroup>
  );
};
