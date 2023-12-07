import React, { useContext, useMemo } from 'react';

import { TodosContext } from '../TodosContext';

import * as todoService from '../../api/todos';

import { TodoItem } from './TodoItem';
import { Status } from '../../types/Status';
import { Error } from '../../types/Error';
// import { Todo } from '../../types/Todo';

export const TodoList: React.FC = () => {
  const {
    todos,
    setTodos,
    todoFilter,
    setTodoError,
  } = useContext(TodosContext);

  const filteredTodos = useMemo(() => {
    switch (todoFilter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todoFilter, todos]);

  const deleteTodo = (id: number) => {
    return todoService.deleteTodo(id)
      .catch(() => {
        setTodoError(Error.DeleteTodoError);
      });
  };

  // const updateTodo = (newTodo: Todo) => {
  //   return todoService.updateTodo(newTodo)
  //     .catch(() => {
  //       setTodoError(Error.UpdateTodoError);
  //     });
  // };

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          deleteTodo={deleteTodo}
          // updateTodo={updateTodo}
        />
      ))}
    </section>
  );
};
