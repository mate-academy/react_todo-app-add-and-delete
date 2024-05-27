import { deleteTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { ErrorTypes } from '../types/enums';
import { handleError } from '../utils/services';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  isLoading: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
  tempTodo: Todo | null;
  setIsFocused: (isFocused: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  setIsLoading,
  setTodos,
  setErrorMessage,
  tempTodo,
  setIsFocused,
}) => {
  const onDelete = (id: number) => {
    setIsLoading(prev => [...prev, id]);

    deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
        setIsFocused(true);
      })
      .catch(() => handleError(ErrorTypes.OnDelErr, setErrorMessage))
      .finally(() => setIsLoading(prev => prev.filter(item => item !== id)));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              isLoading={isLoading}
              onDelete={onDelete}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              setIsLoading={setIsLoading}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              key={tempTodo.id}
              isLoading={isLoading}
              onDelete={onDelete}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              setIsLoading={setIsLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
