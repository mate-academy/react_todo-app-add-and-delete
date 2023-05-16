import { Dispatch, SetStateAction } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  newTodo: Todo | null;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  newTodo,
  setTodos,
  setError,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          classNames="fade"
          timeout={300}
        >
          <TodoItem todo={todo} setTodos={setTodos} setError={setError} />
        </CSSTransition>
      ))}
      {newTodo && (
        <CSSTransition key={newTodo.id} classNames="fade" timeout={300}>
          <TodoItem
            todo={newTodo}
            isLoading
            setTodos={setTodos}
            setError={setError}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
