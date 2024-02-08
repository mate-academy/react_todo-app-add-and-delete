import React from 'react';
import { effect } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  filteredTodos, isError, tempTodo, todos,
} from '../../signals';
import { getTodos } from '../../api/todos';
import { TodoItem } from '../TodoItem/TodoItem';
import { Footer } from '../Footer/Footer';
import { ErrorValues } from '../../types/ErrorValues';

effect(() => {
  getTodos(132)
    .then(response => {
      todos.value = response;
    })
    .catch(() => {
      isError.value = ErrorValues.load;
    });
});

export const TodoList: React.FC = () => {
  useSignals();

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.value
          .map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
            />
          ))}

        {!!tempTodo.value && <TodoItem todo={tempTodo.value} />}
      </section>

      <Footer />
    </>
  );
};
