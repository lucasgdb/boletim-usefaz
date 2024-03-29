import { useEffect } from 'react';
import styled from 'styled-components';

import RequestSent from './components/RequestSent';

const OuterRequestSentPage = styled.div`
  display: grid;
  place-items: center;

  height: 100vh;
  padding: 16px 16px 0;

  background: #0020a2 0 0 no-repeat padding-box !important;
`;

const DotsThingsImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: calc(100% - 64px);

  @media (max-width: 699px) {
    display: none;
  }
`;

const ZLogoImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  max-width: 80%;
`;

export default function RequestSentPage() {
  useEffect(() => {
    document.title = 'Solicitação enviada | Usefaz Admin';
  }, []);

  return (
    <OuterRequestSentPage>
      <DotsThingsImage src="/assets/images/dots.svg" />
      <DotsThingsImage src="/assets/images/things.svg" />

      <RequestSent />

      <ZLogoImage src="/assets/images/z_logo.svg" />
    </OuterRequestSentPage>
  );
}
