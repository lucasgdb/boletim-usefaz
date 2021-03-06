import { SimpleDialog, DialogHeader, DialogTitle, CloseButton, DialogContent, DialogActions } from '@usefaz/components';
import Button from '@mui/material/Button';
import styled from 'styled-components';

import RemoveAvatarButton from './RemoveAvatarButton';

const Description = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: ${(props) => props.theme.text.dialogDescription};
  margin: 0;
`;

const CancelButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

type RemoveAvatarModalProps = {
  open: boolean;
  onClose(): void;
};

export default function RemoveAvatarModal({ open, onClose }: RemoveAvatarModalProps) {
  return (
    <SimpleDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogHeader>
        <DialogTitle>Remover avatar</DialogTitle>
        <CloseButton onClose={onClose} />
      </DialogHeader>

      <DialogContent>
        <Description>Tem certeza que deseja remover seu avatar atual?</Description>
      </DialogContent>

      <DialogActions>
        <CancelButton variant="text" color="secondary" onClick={onClose}>
          Cancelar
        </CancelButton>

        <RemoveAvatarButton onClose={onClose} />
      </DialogActions>
    </SimpleDialog>
  );
}
