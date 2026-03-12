import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { ErrorMessage } from '../types/ErrorMessage';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './TodoList.css';

type Props = {
  todos: Todo[];
  updateTodos: (todos: Todo[]) => void;
  setError: (message: ErrorMessage) => void;
  tempTodo: Todo | null;
  onFocuseInput: (focuse: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodos,
  setError,
  tempTodo,
  onFocuseInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* {todos.map(todo => (
        <TodoItem
          todo={todo}
          updateTodos={updateTodos}
          setError={setError}
          key={todo.id}
          onFocuseInput={onFocuseInput}
        />
      ))} */}

      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              updateTodos={updateTodos}
              setError={setError}
              onFocuseInput={onFocuseInput}
            />
          </CSSTransition>
        ))}

      {/* {tempTodo && <TodoItem todo={tempTodo} />} */}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
