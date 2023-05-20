import { Dispatch, FC, SetStateAction } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/enums';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError:(error: Errors) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setError,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            key={todo.id}
            setTodos={setTodos}
            setError={setError}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoInfo
            todo={tempTodo}
            setTodos={setTodos}
            setError={setError}
            tempTodoId={tempTodo.id}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
