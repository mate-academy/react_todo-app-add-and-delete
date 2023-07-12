import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type TodoListProps = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  processedTodos: number[];
  deleteTodo: (todoId: number) => void;
  setProcessed: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList = ({
  todos,
  tempTodo,
  processedTodos,
  deleteTodo,
  setProcessed,
}: TodoListProps) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={() => {
                setProcessed([todo.id]);
                deleteTodo(todo.id);
              }}
              loading={processedTodos.some((id) => todo.id === id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <Todo key={0} todo={tempTodo} loading />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
