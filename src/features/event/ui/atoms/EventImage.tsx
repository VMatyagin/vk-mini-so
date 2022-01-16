import styled from "styled-components";

const Image = styled.img`
  background-color: transparent;
  width: 100%;
  border-radius: 20px;
  height: 335px;
  object-fit: cover;
`;
export const EventImage = () => {
  return (
    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1024px-Image_created_with_a_mobile_phone.png" />
  );
};
