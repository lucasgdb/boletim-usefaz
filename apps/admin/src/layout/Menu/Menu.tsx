import styled from 'styled-components';
import LockResetIcon from '@mui/icons-material/LockReset';
import SchoolIcon from '@mui/icons-material/School';

import MenuItem, { Item } from './MenuItem';

const OuterMenu = styled.div`
  width: 320px;
  height: 100%;

  background-color: #0020a2;

  @media (min-width: 448px) {
    width: 390px;
  }

  padding: 48px 24px;

  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.25);
  border-bottom-right-radius: 24px;

  z-index: 11;

  transition: width 0.2s;

  @media (min-width: 1200px) {
    padding: 24px 0 40px;
    width: 72px;
    height: 100vh;
    border-bottom-right-radius: 0;

    top: 0;

    overscroll-behavior: contain;

    &&::-webkit-scrollbar {
      background-color: #200741;
      width: 14px;
    }

    &&::-webkit-scrollbar-thumb {
      border: 4px solid #200741;
      border-radius: 8px;
      background-color: #bababa;
    }

    :hover {
      width: 300px;
      overflow-y: auto;
    }
  }
`;

const MenuItemList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;

  overflow-y: auto;
  overflow-x: hidden;

  overflow-y: auto;
  overscroll-behavior: contain;
  height: 500px;
  max-height: calc(90vh - 56px - 96px - 24px);

  @media (min-width: 768px) and (max-width: 1199px) {
    &&::-webkit-scrollbar {
      background-color: #200741;
      width: 14px;
    }

    &&::-webkit-scrollbar-thumb {
      border: 4px solid #200741;
      border-radius: 8px;
      background-color: #bababa;
    }
  }

  @media (min-width: 1200px) {
    overflow-y: unset;
    overscroll-behavior: unset;

    max-height: unset;
  }
`;

const menuItens: Item[] = [
  {
    id: 1,
    name: 'Alunos',
    link: '/',
    Icon: <SchoolIcon />,
  },
  {
    id: 2,
    name: 'Solicitações de Recuperação de Senha',
    link: '/solicitacoes-de-recuperacao-de-senha',
    Icon: <LockResetIcon />,
  },
];

type MenuProps = {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Menu = ({ setIsMenuOpen }: MenuProps) => {
  return (
    <OuterMenu>
      <MenuItemList>
        {menuItens.map((item) => {
          return <MenuItem key={item.id} item={item} setIsMenuOpen={setIsMenuOpen} />;
        })}
      </MenuItemList>
    </OuterMenu>
  );
};

export default Menu;
