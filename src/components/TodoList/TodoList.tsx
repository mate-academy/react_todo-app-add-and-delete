import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type TodoListProps = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  deleteTodo: (todoId: number) => void;
};

export const TodoList = ({ todos, tempTodo, deleteTodo }: TodoListProps) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={() => deleteTodo(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <Todo key={0} todo={tempTodo} loading />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
