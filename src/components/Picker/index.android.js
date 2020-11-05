import React from "react";

import { Picker as RNPickerSelect } from "@react-native-community/picker";
import { PickerView } from "./styles";

export default function Picker({ onChange, tipo }) {
  return (
    <PickerView>
      <RNPickerSelect
        style={{
          width: "100%",
        }}
        onValueChange={(valor) => onChange(valor)}
        selectedValue={tipo}
      >
        <RNPickerSelect.Item label="Selecione um tipo" value="" />
        <RNPickerSelect.Item label="Receita" value="receita" />
        <RNPickerSelect.Item label="Despesa" value="despesa" />
      </RNPickerSelect>
    </PickerView>
  );
}
