import React from 'react';
import { Todo } from '../types/Todo';
import { ErrorType, Filter } from '../App';
import { deleteTodo } from '../api/todos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  isTodoEditing: boolean;
  selectedPostId: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  selectedFilter: Filter;
  tempTodo: null | Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCurrentError: React.Dispatch<React.SetStateAction<ErrorType | ''>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteAllPressed: boolean;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  isTodoEditing,
  selectedPostId,
  setIsTodoEditing,
  setSelectedPostId,
  selectedFilter,
  tempTodo,
  setTodos,
  setCurrentError,
  isLoading,
  setIsLoading,
  isDeleteAllPressed,
}) => {
  let todosCopy: Todo[];

  switch (selectedFilter) {
    case Filter.all:
      todosCopy = [...visibleTodos];
      break;

    case Filter.active:
      todosCopy = [...visibleTodos].filter(todo => !todo.completed);
      break;

    case Filter.completed:
      todosCopy = [...visibleTodos].filter(todo => todo.completed);
      break;

    default:
      todosCopy = [...visibleTodos];
  }

  const handleTodoDelete = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId.toString())
      .then(() => {
        setTodos(visibleTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setCurrentError(ErrorType.UnableToDeleteTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosCopy.map((todo: Todo) => (
          <CSSTransition timeout={300} key={todo.id} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              isTodoEditing={isTodoEditing}
              selectedPostId={selectedPostId}
              setIsTodoEditing={setIsTodoEditing}
              setSelectedPostId={setSelectedPostId}
              handleTodoDelete={handleTodoDelete}
              isLoading={isLoading}
              isDeleteAllPressed={isDeleteAllPressed}
            />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition timeout={300} key={0} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              setIsTodoEditing={setIsTodoEditing}
              setSelectedPostId={setSelectedPostId}
              handleTodoDelete={handleTodoDelete}
              isLoading={isLoading}
              isDeleteAllPressed={isDeleteAllPressed}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
