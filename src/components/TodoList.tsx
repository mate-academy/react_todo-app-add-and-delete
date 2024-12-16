import React, { Dispatch, SetStateAction } from 'react';

import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
// import cn from 'classnames';
import { TempTodo } from './TempTodo';

type Props = {
  filteredTodos: Todo[];
  changeComplete: (todo: Todo) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setIsDeleted: (isDeleted: boolean) => void;
  setErrorMessage: (error: string) => void;
  todosForDelete: Todo[];
};

const TodoList: React.FC<Props> = ({
  filteredTodos,
  changeComplete,
  setTodos,
  tempTodo,
  setIsDeleted,
  setErrorMessage,
  todosForDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            changeComplete={changeComplete}
            setTodos={setTodos}
            setIsDeleted={setIsDeleted}
            setErrorMessage={setErrorMessage}
            todosForDelete={todosForDelete}
          />
        ))}
        {tempTodo && <TempTodo tempTodo={tempTodo} />}
      </>
    </section>
  );
};

export default React.memo(TodoList);
