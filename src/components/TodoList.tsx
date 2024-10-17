import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

interface TodoListProps {
  todosAfterFiltering: Todo[];
  tempTodo?: Todo | null;
  loadingTodos: number[];
  onTodoDelete: (todoId: number) => void;
  onTodoToggle: (todoId: number, currentCompletedStatus: boolean) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todosAfterFiltering,
  tempTodo,
  loadingTodos,
  onTodoDelete,
  onTodoToggle,
}) => {
  const handleEndListener = (node: HTMLElement, done: () => void) => {
    node.addEventListener('transitionend', done, false);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosAfterFiltering.map(todo => (
          <CSSTransition
            key={todo.id}
            classNames="item"
            timeout={300}
            addEndListener={handleEndListener}
          >
            <TodoComponent
              todo={todo}
              isLoading={loadingTodos.includes(todo.id)}
              tempTodo={null}
              onTodoDelete={onTodoDelete}
              onTodoToggle={onTodoToggle}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            classNames="item"
            timeout={300}
            addEndListener={handleEndListener}
          >
            <TodoComponent
              todo={tempTodo}
              isLoading={loadingTodos.includes(0)}
              tempTodo={tempTodo}
              onTodoDelete={onTodoDelete}
              onTodoToggle={onTodoToggle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
