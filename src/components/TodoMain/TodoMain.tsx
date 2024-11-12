/* eslint-disable max-len */

import { useCallback, useContext, useEffect, useState } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { TodoItemList } from '../TodoList/TodoList';
import { getTodos } from '../../api/todos';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoContext } from '../../context/todo/TodoContext';
import { TodoErrorMessage } from '../../types/TodoErrorMessage';
import { TodoTempItem } from '../TodoTempItem/TodoTempItem';
import { TodoErrorNotification } from '../TodoErrorNotification/TodoErrorNotification';

export const TodoMain = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const { isLoading, setIsLoading, setErrorMessage } = useContext(TodoContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isLoading) {
      getTodos()
        .then(setTodos)
        .catch(() => {
          setErrorMessage(TodoErrorMessage.LOAD_ERROR);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  const filterTodosByStatus = useCallback(() => {
    switch (filterStatus) {
      case Status.All:
        return todos;
      case Status.Active:
        return todos.filter((todo: Todo) => !todo.completed);
      case Status.Completed:
        return todos.filter((todo: Todo) => todo.completed);
    }
  }, [todos, filterStatus]);

  const filteredTodos = filterTodosByStatus();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoHeader>
        <TodoForm />
      </TodoHeader>

      <section className="todoapp__main" data-cy="TodoList">
        <TodoItemList todos={filteredTodos} />

        <TodoTempItem />
      </section>

      <TodoFooter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        todos={todos}
      />

      <TodoErrorNotification />
    </div>
  );
};
