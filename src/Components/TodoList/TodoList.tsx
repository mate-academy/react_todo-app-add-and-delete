import React, { useState } from 'react';

import { Todo } from '../../types/Todo';
import { deleteTodos, updateTodos } from '../../api/todos';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isDisableInput: boolean;
  setIsDisableInput: (value: boolean) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  isDisableInput,
  setIsDisableInput,
  tempTodo,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  const handleDelete = (todoId: number) => {
    setIsDisableInput(true);
    setSelectedTodoId(todoId);

    deleteTodos(todoId)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch()
      .finally(() => {
        setIsDisableInput(false);
      });
  };

  const handleChangeComplete = (todo: Todo) => {
    // eslint-disable-next-line no-param-reassign
    todo.completed = !todo.completed;
    setSelectedTodoId(todo.id);

    updateTodos(todo)
      .then(data => setTodos((currentTodos) => {
        return [
          ...currentTodos
            .map(todoMap => (todoMap.id === todo.id ? data : todoMap)),
        ];
      }))
      .finally(() => setSelectedTodoId(0));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodoId={selectedTodoId}
          handleChangeComplete={handleChangeComplete}
          handleDelete={handleDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isDisableInput={isDisableInput}
        />
      )}
    </section>
  );
};
