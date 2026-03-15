/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/ErrMsg';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isSumbitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setErrMsg('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrMsg(Error.Fetch);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleErrorClose = () => {
    setErrMsg('');
  };

  const onAddTodo = (title: string) => {
    setIsSubmitting(true);
    setErrMsg('');

    const newTodo = {
      id: 0,
      title: title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then(created => {
        setTodos(prev => [...prev, created]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrMsg(Error.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleOnDelete = (id: number) => {
    setDeletingId(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrMsg(Error.Delete);
      })
      .finally(() => {
        setDeletingId(prev => prev.filter(i => i !== id));
      });
  };

  const onDeleteCompletedTodos = () => {
    const completedIds = todos.filter(todo => todo.completed);

    if (completedIds.length === 0) {
      return;
    }

    completedIds.forEach(todo => {
      handleOnDelete(todo.id);
    });
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length > 0,
    [todos],
  );

  const areAllCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isSubmitting={isSumbitting}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onAddTodo={onAddTodo}
          setErrMsg={setErrMsg}
          areAllCompleted={areAllCompleted}
        />

        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          deletingId={deletingId}
          handleDelete={handleOnDelete}
        />

        {tempTodo && (
          <TodoItem key={tempTodo.id} todo={tempTodo} isSubmitting />
        )}

        {todos.length !== 0 && (
          <TodoFooter
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodos={onDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errMsg={errMsg} onClose={handleErrorClose} />
    </div>
  );
};
