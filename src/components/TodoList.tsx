import { useContext } from 'react';
import { TodosContext } from './TodosContext';
import { TodoItem } from './TodoItem';
import { FilterOption } from '../types/FilterOption';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';

export const TodoList: React.FC = () => {
  const {
    todos,
    setErrorMessage,
    filterOption,
  } = useContext(TodosContext);

  const visibleTodo = todos.filter(todo => {
    switch (filterOption) {
      case FilterOption.Active:
        return !todo.completed;

      case FilterOption.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const deleteTodo = (id: number) => {
    return todoService.deleteTodo(id)
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const updatedTodo = (newTodo: Todo) => {
    return todoService.updateTodo(newTodo)
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  return (
    <ul className="todo-list" data-cy="todosList">
      {visibleTodo.map(todo => (
        <TodoItem
          todo={todo}
          deleteTodo={deleteTodo}
          updatedTodo={updatedTodo}
          key={todo.id}
        />
      ))}
    </ul>
  );
};
