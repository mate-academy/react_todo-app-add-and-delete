import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';
import '../../styles/todolist.scss';

type Props = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              todos={todos}
              setTodos={setTodos}
              setError={setError}
              setErrorMessage={setErrorMessage}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
