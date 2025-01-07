/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent/TodoComponent';

interface Props {
  changeTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  filter: boolean | '';
}

export const TodoElements: React.FC<Props> = ({
  changeTodos,
  setErrorMesage,
  todos,
  filter,
}) => {
  function components(filteredTodo: Todo[]) {
    return filteredTodo.map(todo => (
      <TodoComponent
        key={todo.id}
        changeTodos={changeTodos}
        setErrorMesage={setErrorMesage}
        todos={todos}
        todo={todo}
      />
    ));
  }

  function FilteredComponents() {
    if (filter === '') {
      return components(todos);
    } else {
      return components(todos.filter(todo => todo.completed === filter));
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {FilteredComponents()}
    </section>
  );
};
