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
  loader: boolean;
  title: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  setErrorMessage,
  loader,
  title,
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

        {loader === false && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">{title}</span>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
