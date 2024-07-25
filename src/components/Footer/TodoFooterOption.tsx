import classNames from 'classnames';
import { Option } from '../../types/Option';
import { SortType } from '../../enums/SortType';

type Props = {
  option: Option;
  filterType: SortType;
  onClick: (newType: SortType) => void;
};

const TodoFooterOption = ({ option, filterType, onClick }: Props) => {
  const { href, sortType, title, dataCY } = option;

  return (
    <a
      href={href}
      className={classNames('filter__link', {
        selected: filterType === sortType,
      })}
      data-cy={dataCY}
      onClick={() => onClick(sortType)}
    >
      {title}
    </a>
  );
};

export default TodoFooterOption;
