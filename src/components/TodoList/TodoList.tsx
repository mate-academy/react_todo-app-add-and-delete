import React, { useContext } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../TodosContext/TodosContext';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { FilterOption } from '../../types/FilterOption';

export const TodoList: React.FC = () => {
  const { todos, filterOption, setErrorMessage } = useContext(TodosContext);

  const visibleTodo = todos.filter(todo => {
    switch (filterOption) {
      case FilterOption.Active:
        return !todo.completed;
      case FilterOption.Completed:
        return todo.completed;
      case FilterOption.All:
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
    return todoService.updatedTodo(newTodo)
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  return (
    <ul className="todo-list" data-cy="todosList">
      {visibleTodo.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updatedTodo={updatedTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};
