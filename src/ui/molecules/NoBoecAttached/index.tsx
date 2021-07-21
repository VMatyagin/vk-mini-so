import { Subhead, Title } from "@vkontakte/vkui";
import styled from "styled-components";

const AlignmentWrapper = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    position: relative;
`;

export const NoBoecAttached = () => (
    <AlignmentWrapper>
        <Title level="2" weight="medium">
            Ваш ВК не привязан к бойцу.
        </Title>
        <Subhead weight="regular">Обратитесь к своему КС</Subhead>
    </AlignmentWrapper>
);
