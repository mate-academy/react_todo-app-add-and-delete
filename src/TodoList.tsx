import { Todo } from "./types/Todo";
import { Sort } from './types/Sort';
import { Dispatch, SetStateAction } from 'react';
import { TodoItem } from "./TodoItem";

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  selectedFilter: Sort,
  setErrorMessage: Dispatch<SetStateAction<string>>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  selectedFilter,
  setErrorMessage,
}) => {

  const filterTodos = (() => {
    switch (selectedFilter) {
      case Sort.Active:
        return todos.filter(todo => !todo.completed);

      case Sort.Completed:
        return todos.filter(todo => todo.completed);

      case Sort.All:
      default:
        return todos;
    }
  }) ();

  return (
    <div>
      {filterTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </div>
  );
}

