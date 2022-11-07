import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { ErrorType } from '../../Enums/Enums';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  todos: Todo[];
  setError: (p: ErrorType) => void;
  onDeleteTodo: (p: number) => void;
  isDeleting: boolean;
  isAdding: boolean,
  title: string;
};

export const TodoList: React.FC<Props> = ({
  todos, setError, onDeleteTodo, isDeleting, isAdding, title,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {
        todos.map(todo => (
          <li key={todo.id}>
            <TodoInfo
              todo={todo}
              setError={setError}
              onDeleteTodo={onDeleteTodo}
              isDeleting={isDeleting}
            />
          </li>
        ))
      }
      <li>
        {
          isAdding && (
            <TempTodo title={title} />
          )
        }
      </li>
    </ul>
  );
};
