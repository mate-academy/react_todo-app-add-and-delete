/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Error, Footer, NewTodo, TodoItem, TodoList } from './components';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodo, createTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';

export const App: React.FC = () => {
  const [currentTodoList, setCurrentTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState(FilterOptions.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [todosBeingDeleted, setTodosBeingDeleted] = useState<number[]>([]);

  const handleCreateTodo = async ({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>) => {
    const tempTodoItem: Todo = { id: 0, title, userId, completed };

    setTempTodo(tempTodoItem);

    setIsInputDisabled(true);

    try {
      const newTodo = await createTodo({ title, userId, completed });

      setCurrentTodoList(currentTodos => [...currentTodos, newTodo]);
      setTempTodo(null);
      setInputValue('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(async () => setErrorMessage(''), 3000);
      setTempTodo(null);
    } finally {
      setIsInputDisabled(false);
    }
  };

  const handleDeleteTodo = async (postId: number) => {
    setIsInputDisabled(true);
    setTodosBeingDeleted(currentArray => [...currentArray, postId]);

    try {
      await deleteTodo(postId);

      setTimeout(() => {
        setCurrentTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== postId),
        );
      }, 200);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(async () => setErrorMessage(''), 3000);
      setCurrentTodoList(currentTodos => currentTodos);
      setTodosBeingDeleted([]);
    } finally {
      setIsInputDisabled(false);
    }
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = currentTodoList.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleFilterChange = (newFilter: FilterOptions) => {
    setActiveFilter(newFilter);
  };

  useEffect(() => {
    getTodos()
      .then((todos: Todo[]) => {
        setCurrentTodoList(todos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const visibleTodos = currentTodoList.filter(todo => {
    switch (activeFilter) {
      case FilterOptions.ACTIVE:
        return !todo.completed;
      case FilterOptions.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          currentTodoList={currentTodoList}
          handleCreateTodo={handleCreateTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={isInputDisabled}
          setIsInputDisabled={setIsInputDisabled}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        {visibleTodos && (
          <section className="todoapp__main" data-cy="TodoList">
            <>
              <TodoList
                visibleTodos={visibleTodos}
                handleDeleteTodo={handleDeleteTodo}
                todosBeingDeleted={todosBeingDeleted}
              />
              {tempTodo && <TodoItem todo={tempTodo} tempTodo={tempTodo} />}
            </>
          </section>
        )}

        {!!currentTodoList[0] && (
          <Footer
            currentTodoList={currentTodoList}
            activeFilter={activeFilter}
            handleFilterChange={handleFilterChange}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
