import { Subhead, Title } from "@vkontakte/vkui";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Lottie from "react-lottie-player";

const AlignmentWrapper = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    position: relative;
    background-color: white;
`;

export const NoBoecAttached = () => {
    const [animationData, setAnimationData] = useState<object>();

    useEffect(() => {
        import("./walking-animation.json").then(setAnimationData);
    }, []);
    return (
        <AlignmentWrapper>
            {animationData && (
                <Lottie
                    loop
                    animationData={animationData}
                    play
                    style={{ width: 150, height: 150 }}
                />
            )}
            <Title level="2" weight="medium">
                У вас нет доступа
            </Title>
            <Subhead weight="regular">Обратитесь к ком. составу</Subhead>
        </AlignmentWrapper>
    );
};
