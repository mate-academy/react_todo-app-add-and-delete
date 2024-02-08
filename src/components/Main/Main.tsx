import React, { useContext } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempTodoItem } from '../TempTodoItem/TempTodoItem';
import { TodosContext } from '../../TodosContext/TodosContext';
import { filterTodos } from '../../services/filterTodos';

export const Main: React.FC = () => {
  const {
    editedTodoTitle,
    setEditedTodoTitle,
    handleSpanDoubleClick,
    handleDeleteTodo,
    editedTodoId,
    handleEditTodo,
    handleCompleteChange,
    temptTodo,
    todos,
    filteringBy,
  } = useContext(TodosContext);

  const filteredTodos = filterTodos(todos, filteringBy);

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          editedTodoTitle={editedTodoTitle}
          setEditedTodoTitle={setEditedTodoTitle}
          handleSpanDoubleClick={handleSpanDoubleClick}
          handleDeleteTodo={handleDeleteTodo}
          editedTodoId={editedTodoId}
          handleEditTodo={handleEditTodo}
          handleCompleteChange={handleCompleteChange}
        />

      ))}
      {temptTodo && (
        <TempTodoItem
          todo={temptTodo}
          key={temptTodo.id}
        />
      )}

    </section>
  );
};
