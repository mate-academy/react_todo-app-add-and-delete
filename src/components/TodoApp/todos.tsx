import { useState } from 'react';
import { LoadedTodo } from './Todo';
import { LoadingTodo } from './loadingTodo';
import { TodoInput } from './TodoInput';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { ErrorType } from '../../types/Error';

type Props = {
  todos: Todo[],
  filter: FilterType,
  onError: (error: ErrorType) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
};

const filter = (type: FilterType, todos: Todo[]) => {
  if (type === FilterType.ACTIVE) {
    return todos.filter((todo) => !todo.completed);
  }

  if (type === FilterType.COMPLETED) {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
};

export const Todos:React.FC<Props> = ({
  todos,
  filter: filterType,
  onError: setErrorType,
  setTodos,
}) => {
  const [editableTodoId, setEditableTodoId] = useState<number | null>(null);
  const [todoLoadId] = useState<number | null>(null);

  const filteredTodos = filter(filterType, todos);

  return (
    <>
      {filteredTodos.map((todo: Todo) => {
        if (todo.id === editableTodoId) {
          return (
            <div key={todo.id}>
              <TodoInput
                todo={todo}
                setEditableTodoId={setEditableTodoId}
                setTodos={setTodos}
                onError={setErrorType}
              />
            </div>
          );
        }

        if (todoLoadId === todo.id) {
          return (
            <div key={todo.id}>
              <LoadingTodo todo={todo} />
            </div>
          );
        }

        return (
          <div key={todo.id}>
            <LoadedTodo
              todo={todo}
              onError={setErrorType}
              setTodos={setTodos}
              onEditId={setEditableTodoId}
            />
          </div>
        );
      })}
    </>
  );
};
