import React, { useContext } from 'react';
import { TodoContext } from './TodoContex';
import { Filter } from '../types/Filter';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const {
    todos,
    setErrorMessage,
    filter,
  } = useContext(TodoContext);

  const currentTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.All:
        return true;

      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const todoUpdate = (newTodo: Todo) => {
    return updateTodo(newTodo)
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  const todoDelete = (id: number) => {
    return deleteTodo(id)
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  return (
    <ul className="todo-list" data-cy="todosList">
      {currentTodos.map(todo => (
        <TodoItem
          todo={todo}
          deleteTodo={todoDelete}
          updatedTodo={todoUpdate}
          key={todo.id}
        />
      ))}
    </ul>
  );
};

export default TodoList;
