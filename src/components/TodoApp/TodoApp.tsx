import { useMemo, useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { FilterStatus } from '../../types/enums';
import { filterTodos } from '../../utils/filterTodos';
import { Todo } from '../../types/Todo';
import { UserWarning } from '../../UserWarning';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { TodoMain } from '../TodoMain/TodoMain';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { USER_ID } from '../../types/constants';

export const TodoApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    todos,
    setTodos,
    isLoading,
    currentError,
    setCurrentError,
    handleAddTodo,
    inputRef,
    tempTodo,
    handleDeleteTodos,
    handleDeleteAllTodos,
  } = useTodos();
  const [activeFilterStatus, setActiveFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const handleHideError = (): void => {
    setCurrentError('');
  };

  const filteredTodos: Todo[] = useMemo(
    () => filterTodos(todos, activeFilterStatus),
    [todos, activeFilterStatus],
  );

  const handleChangeFilter = (type: FilterStatus) => {
    setActiveFilterStatus(type);
  };

  const handleCheckTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const quantityActiveTasks = todos.filter(todo => !todo.completed).length;

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          quantityActiveTasks={quantityActiveTasks}
          handleSearchQuery={handleSearchQuery}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
          isAddLoading={isLoading.add}
        />

        <TodoMain
          isLoading={isLoading}
          handleCheckTodo={handleCheckTodo}
          handleDeleteTodos={handleDeleteTodos}
          filteredTodos={
            tempTodo ? [...filteredTodos, tempTodo] : filteredTodos
          }
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            quantityActiveTasks={quantityActiveTasks}
            activeFilterStatus={activeFilterStatus}
            handleChangeFilter={handleChangeFilter}
            handleDeleteAllTodos={handleDeleteAllTodos}
          />
        )}
      </div>

      <ErrorNotification
        currentError={currentError}
        handleHideError={handleHideError}
      />
    </div>
  );
};
