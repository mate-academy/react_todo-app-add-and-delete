import { useContext, useEffect, useState } from 'react';
import { TodosContext } from '../../Context/TodoContext';
import { TodoElement } from '../TodoElement';
import { EditProvider } from '../../Context/EditContext';

export const TodoList = () => {
  const { state } = useContext(TodosContext);
  const { todos, filter, tempTodo } = state;
  const [visibleTodos, setVisibleTodos] = useState(todos);

  useEffect(() => {
    let filteredTodos = todos;

    if (filter === 'COMPLETED') {
      filteredTodos = todos.filter(todo => todo.completed);
    } else if (filter === 'ACTIVE') {
      filteredTodos = todos.filter(todo => !todo.completed);
    }

    setVisibleTodos(filteredTodos);
  }, [filter, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length !== 0 && (
        <EditProvider>
          {visibleTodos.map(todo => (
            <TodoElement key={todo.id} todo={todo} />
          ))}
        </EditProvider>
      )}
      {tempTodo && (
        <TodoElement
          key={`temp-${tempTodo.id}-${tempTodo.title}`}
          todo={tempTodo}
          isLoading
        />
      )}
    </section>
  );
};
