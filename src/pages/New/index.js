import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import Header from "../../components/Header";
import { Background, Input, SubmitButton, SubmitText } from "./styles";

import { format } from "date-fns";

import firebase from "../../services/FirebaseConnection";

import Picker from "../../components/Picker";
import { AuthContext } from "../../contexts/auth";

export default function New() {
  const navigation = useNavigation();
  const { user: usuario } = useContext(AuthContext);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState(null);

  function register() {
    if (isNaN(parseFloat(valor)) || !tipo) {
      alert("preencha todos os campos");
      return;
    }
    Alert.alert("Confirmando dados", `Tipo: ${tipo} - valor ${parseFloat(valor)}`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Continuar",
        onPress: () => handleAdd(),
      },
    ]);
    Keyboard.dismiss();
  }

  async function handleAdd() {
    const uid = usuario.uid;

    const key = await firebase.database().ref("historico").child(uid).push().key;
    await firebase
      .database()
      .ref("historico")
      .child(uid)
      .child(key)
      .set({
        tipo,
        valor: parseFloat(valor),
        date: format(new Date(), "dd/MM/yyyy"),
      });

    const user = firebase.database().ref("users").child(uid);

    await user.once("value").then((snapshot) => {
      let saldo = parseFloat(snapshot.val().saldo);

      tipo === "despesa" ? (saldo -= parseFloat(valor)) : (saldo += parseFloat(valor));

      user.child("saldo").set(saldo);
    });

    setValor("");
    setTipo(null);
    Keyboard.dismiss();
    navigation.navigate("Home");
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Background>
        <Header />
        <SafeAreaView
          style={{
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Valor Desejado"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={valor}
            onChangeText={(text) => setValor(text)}
          />

          <Picker onChange={setTipo} tipo={tipo} />

          <SubmitButton onPress={() => register()}>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
}
