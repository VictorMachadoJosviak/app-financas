import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Container, Header } from "./styles";
import { Platform, TouchableOpacity, Text } from "react-native";

export default function DatePicker({ date, onClose, onChange }) {
  const [dateNow, setDateNow] = useState(date);
  return (
    <Container>
      {Platform.OS === "ios" && (
        <Header>
          <TouchableOpacity onPress={onClose}>
            <Text>Fechar</Text>
          </TouchableOpacity>
        </Header>
      )}
      <DateTimePicker
        value={dateNow}
        mode="date"
        display="default"
        style={{ backgroundColor: "white" }}
        onChange={(e, d) => {
          const currentDate = d || dateNow;
          setDateNow(currentDate);
          onChange(currentDate);
        }}
      />
    </Container>
  );
}
