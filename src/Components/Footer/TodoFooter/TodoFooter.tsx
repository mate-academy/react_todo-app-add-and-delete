import { FooterNav } from '../FooterNav/FooterNav';
import { useTodoContext } from '../../../Context/Context';

interface Props {
  activeTodos:number;
}
export const TodoFooter:React.FC<Props> = ({ activeTodos }) => {
  const {
    multiplyDelite,
    todosForDelete,
  } = useTodoContext();

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {`${activeTodos} items left`}
      </span>
      <FooterNav />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={multiplyDelite}
        disabled={!todosForDelete.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
