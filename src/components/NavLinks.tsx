import classNames from 'classnames';
import { ActiveLink } from '../types/ActiveLink';

type Props = {
  activeLink: ActiveLink;
  setActiveLink: (l: ActiveLink) => void;
};

export const NavLinks = ({ activeLink, setActiveLink }: Props) => {
  return (
    <nav className="filter" data-cy="Filter">
      {(Object.keys(ActiveLink) as Array<keyof typeof ActiveLink>).map(link => {
        const linkValue = ActiveLink[link];

        return (
          <a
            key={link}
            href="#/"
            className={classNames('filter__link', {
              selected: activeLink === linkValue,
            })}
            data-cy={`FilterLink${link}`}
            onClick={() => {
              setActiveLink(linkValue);
            }}
          >
            {link}
          </a>
        );
      })}
    </nav>
  );
};
