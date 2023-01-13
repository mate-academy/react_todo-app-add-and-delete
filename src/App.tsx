import { FunctionComponent } from 'react';
import { TodoApp } from './components/TodoApp';

export const App: FunctionComponent = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoApp />
      </div>
    </div>
  );
};
