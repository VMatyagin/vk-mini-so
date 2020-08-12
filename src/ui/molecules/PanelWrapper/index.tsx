import styled from "styled-components";

export const PanelWrapper = styled.div`
  display: flex;
  align-items: stretch;
  ::before,
  ::after {
    content: "";
    display: block;
    flex-shrink: 0;
    width: 16px;
  }
`;