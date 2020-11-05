import { format, isBefore } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import HistoricoList from "../../components/HistoricoList";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/FirebaseConnection";
import { Background, Container, List, Nome, Saldo, Title, Area } from "./styles";

import Icon from "react-native-vector-icons/MaterialIcons";

import DatePicker from "../../components/DatePicker";

export default function Home() {
  const { user } = useContext(AuthContext);
  const uid = user && user.uid;
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    async function loadList() {
      await firebase
        .database()
        .ref("users")
        .child(uid)
        .on("value", (snapshot) => {
          setSaldo(snapshot.val().saldo);
        });

      await firebase
        .database()
        .ref("historico")
        .child(uid)
        .orderByChild("date")
        .equalTo(format(newDate, "dd/MM/yyyy"))
        .limitToLast(10)
        .on("value", (snapshot) => {
          setHistorico([]);

          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date,
            };

            setHistorico((oldArray) => [...oldArray, list].reverse());
          });
        });
    }
    loadList();
  }, [newDate]);

  async function handleDeleteSuccess(data) {
    await firebase
      .database()
      .ref("historico")
      .child(uid)
      .child(data.key)
      .remove()
      .then(async () => {
        let saldoAtual = saldo;
        data.tipo === "despesa" ? (saldoAtual += parseFloat(data.valor)) : (saldoAtual -= parseFloat(data.valor));

        await firebase.database().ref("users").child(uid).child("saldo").set(saldoAtual);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDelete(data) {
    //Pegando data do item:
    const [diaItem, mesItem, anoItem] = data.date.split("/");
    const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);
    console.log(dateItem);

    //Pegando data hoje:
    const formatDiaHoje = format(new Date(), "dd/MM/yyyy");
    const [diaHoje, mesHoje, anoHoje] = formatDiaHoje.split("/");
    const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);
    console.log(dateHoje);

    if (isBefore(dateItem, dateHoje)) {
      // Se a data do registro já passou vai entrar aqui!
      alert("Voce nao pode excluir um registro antigo!");
      return;
    }

    Alert.alert("Cuidado Atençao!", `Você deseja excluir ${data.tipo} - Valor: ${data.valor}`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Continuar",
        onPress: () => handleDeleteSuccess(data),
      },
    ]);
  }

  function handleShowPicker() {
    setShowPicker(true);
  }
  function handleClose() {
    setShowPicker(false);
  }
  function onChange(date) {
    setShowPicker(Platform.OS === "ios");
    setNewDate(date);
  }

  return (
    <Background>
      <Header />
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>R$ {saldo && saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}</Saldo>
      </Container>
      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" size={30} color="#fff" />
        </TouchableOpacity>
        <Title>Ultimas Movimentações</Title>
      </Area>
      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        renderItem={({ item }) => <HistoricoList data={item} deleteItem={handleDelete} />}
        keyExtractor={(item) => item.key}
      />
      {showPicker && <DatePicker onClose={() => handleClose()} date={newDate} onChange={onChange} />}
    </Background>
  );
}
