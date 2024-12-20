/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorStatus } from './types/ErrorStatus';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorStatus>(ErrorStatus.Empty);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(res => setTodoList(res))
      .catch(() => {
        setError(ErrorStatus.UnableToLoad);
      });
  }, []);

  const filteredTodoList = (): Todo[] => {
    switch (filter) {
      case Status.Active:
        return todoList.filter(todo => !todo.completed);
      case Status.Completed:
        return todoList.filter(todo => todo.completed);
      default:
        return todoList;
    }
  };

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodoList(prev => [...prev, newTodo]);
    } catch (err) {
      setError(ErrorStatus.UnableToAdd);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onRemoveTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodoList(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setError(ErrorStatus.UnableToDelete);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todoList.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onRemoveTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={onAddTodo}
          setErrorMessage={setError}
          todoLength={todoList.length}
        />

        {!!todoList.length && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodoList().map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onRemoveTodo={onRemoveTodo}
                  isLoading={loadingTodoIds.includes(todo.id)}
                />
              ))}
              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  isLoading
                  onRemoveTodo={onRemoveTodo}
                />
              )}
            </section>
            <Footer
              todosCounter={todoList.filter(todo => !todo.completed).length}
              filterStatus={filter}
              setFilter={setFilter}
              onClearCompleted={onClearCompleted}
              showClearCompletedButton={todoList.some(todo => todo.completed)}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
