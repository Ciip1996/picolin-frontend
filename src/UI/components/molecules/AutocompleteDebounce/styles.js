import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 1rem;
  background: #f3f3f3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 2rem;
  border: none;
  outline: 0;
  background: white;
  font-family: 'Roboto';
  font-size: 14px;
`;

export const Ul = styled.ul`
  display: contents;
`;

export const Li = styled.ul`
  width: 100%;
  min-height: 40px;
  padding: 1rem;
  background: white;
  display: block;
  border-bottom: 1px solid white;
  display: flex;
  &:hover {
    cursor: pointer;
    background-color: rgba(202, 202, 202, 1);
  }
`;

export const SuggestContainer = styled.div`
  border-radius: 1rem;
  -webkit-box-shadow: 13px 14px 23px -8px rgba(0, 0, 0, 0.59);
  -moz-box-shadow: 13px 14px 23px -8px rgba(0, 0, 0, 0.59);
  box-shadow: 13px 14px 23px -8px rgba(0, 0, 0, 0.59);
  z-index: 1000;
  position: relative;
  max-height: 300px;
  flex: 1;
  overflow: scroll;
  margin: 0.5rem;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
