import styled from "styled-components/native";

export const Background = styled.View`
  flex: 1;
  background-color: #131313;
`;
export const Input = styled.TextInput.attrs({
  placeholderTextColor: "#222",
})`
  height: 50px;
  width: 90%;
  background-color: rgba(255, 255, 255, 0.9);
  margin-top: 30px;
  font-size: 16px;
  border-radius: 7px;
`;

export const SubmitButton = styled.TouchableOpacity`
  background-color: #00b94a;
  width: 90%;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 7px;
  margin-top: 10px;
`;
export const SubmitText = styled.Text`
  font-size: 20px;
  color: #131313;
`;
