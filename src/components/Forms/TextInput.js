import React from 'react'
import styled from 'react-emotion'

const InputContainer = styled('div')``
const Input = styled('input')`
  height: 40px;
  font-size: 14px;
  color: #1e1e1e;
  border-radius: 2px;
  border: 1px solid #edeef4;
  padding-left: 30px;
  ${({ wide }) => wide && `width: 100%`};
  &:focus {
    outline: 0;
    border: 1px solid #6e76ff;
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #ccced8;
    opacity: 1; /* Firefox */
  }
`

const SearchContainer = styled(InputContainer)``

const SearchInput = styled(Input)`
  background-color: rgba(243, 243, 249, 0.5);
`

export const Search = ({ placeholder = '', innerRef, ...props }) => (
  <SearchContainer {...props}>
    <SearchInput
      type="text"
      placeholder={placeholder}
      innerRef={innerRef}
      {...props}
    />
  </SearchContainer>
)

const TextInput = ({ placeholder = '', innerRef, ...props }) => (
  <InputContainer {...props}>
    <Input
      type="text"
      placeholder={placeholder}
      innerRef={innerRef}
      {...props}
    />
  </InputContainer>
)

export default TextInput
