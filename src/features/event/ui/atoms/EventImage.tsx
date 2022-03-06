import { FC } from "react";
import styled from "styled-components";

const Image = styled.img`
  background-color: transparent;
  width: 100%;
  border-radius: 20px;
  height: 335px;
  object-fit: cover;
`;
interface EventImageProps {
  src: string;
}
export const EventImage: FC<EventImageProps> = ({ src }) => {
  return <Image src={src} />;
};
