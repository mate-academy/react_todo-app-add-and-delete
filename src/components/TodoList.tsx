import { Dispatch, SetStateAction } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { ErrorType, Todo } from '../types';
import { deleteTodo } from '../api/todos';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  setTodos: Dispatch<SetStateAction<Todo[]>>
  isLoading: number[]
  setIsLoading: Dispatch<SetStateAction<number[]>>
  handleError: (error: ErrorType) => void
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    setTodos,
    isLoading,
    setIsLoading,
    handleError,
  } = props;

  const handleTodoDelete = (id: number) => {
    setIsLoading(prev => [...prev, id]);

    const deletingTodo = async () => {
      try {
        if (todos) {
          await deleteTodo(id);
          setTodos(prev => prev.filter(todo => todo.id !== id));
        }
      } catch (error) {
        handleError(ErrorType.DELETE);
      } finally {
        setIsLoading(prev => prev.filter(todoId => todoId !== id));
      }
    };

    deletingTodo();
  };

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
              key={todo.id}
              handleTodoDelete={handleTodoDelete}
              isLoading={isLoading}
              tempTodo={tempTodo}
              todo={todo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={tempTodo.id}
              handleTodoDelete={handleTodoDelete}
              isLoading={isLoading}
              tempTodo={tempTodo}
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
