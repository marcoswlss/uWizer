import React from 'react'
import { StyleSheet, Platform, Image, Text, View,ScrollView,TouchableOpacity,FlatList } from 'react-native'
import {Header,Input,Button,Body, Icon, Content,Footer, FooterTab,Card,CardItem,Thumbnail,Right,Left,Container,Form,Item,Picker, Textarea} from 'native-base'
import Hyperlink from 'react-native-hyperlink'
import {firebaseDatabase} from './config'
import firebase from 'react-native-firebase';
export default class Eventos_Publicos extends React.Component {

  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      eventos:[]
    };
  }

  handleFiltro = () => {
    const { nome_grupo_filtro} = this.state
    if(nome_grupo_filtro == ''){
      const rootPub = firebaseDatabase.ref('Eventos_Publicos');
      rootPub.on('value', (childSnapshot) => {
        const eventos = [];
        childSnapshot.forEach((doc) => {
          eventos.push({
            usuario: doc.toJSON().usuario,
            nome_usuario : doc.toJSON().nome_usuario,
            titulo : doc.toJSON().titulo,
            data_evento : doc.toJSON().data_evento,
            horario : doc.toJSON().horario,
            descricao:doc.toJSON().descricao,
            local_link:doc.toJSON().local_link,
            nome_grupo_publico:doc.toJSON().nome_grupo_publico,
            nome_faculdade:doc.toJSON().nome_faculdade,
            nome_curso:doc.toJSON().nome_curso,
            selected_heroi:doc.toJSON().selected_heroi,
            });
            this.setState({
              eventos: eventos.sort((a, b) => {
                return (a.data_evento<b.data_evento);
              }),
              loading: false,
            }); 
          });
      });
    }else{
      const rootPub = firebaseDatabase.ref('Eventos_Publicos').orderByChild("nome_grupo_publico").equalTo(nome_grupo_filtro);
      rootPub.on('value', (childSnapshot) => {
        const eventos = [];
        childSnapshot.forEach((doc) => {
          eventos.push({
            usuario: doc.toJSON().usuario,
            nome_usuario : doc.toJSON().nome_usuario,
            titulo : doc.toJSON().titulo,
            data_evento : doc.toJSON().data_evento,
            horario : doc.toJSON().horario,
            descricao:doc.toJSON().descricao,
            local_link:doc.toJSON().local_link,
            nome_grupo_publico:doc.toJSON().nome_grupo_publico,
            nome_faculdade:doc.toJSON().nome_faculdade,
            nome_curso:doc.toJSON().nome_curso,
            selected_heroi:doc.toJSON().selected_heroi,
            });
            this.setState({
              eventos: eventos.sort((a, b) => {
                return (a.data_evento<b.data_evento);
              }),
              loading: false,
            }); 
          });
      });
    }
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};
 
  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    const rootPosts = firebaseDatabase.ref('Eventos_Publicos');
    rootPosts.on('value', (childSnapshot) => {
      const eventos = [];
      childSnapshot.forEach((doc) => {
        eventos.push({
          usuario: doc.toJSON().usuario,
          nome_usuario : doc.toJSON().nome_usuario,
          titulo : doc.toJSON().titulo,
          data_evento : doc.toJSON().data_evento,
          horario : doc.toJSON().horario,
          descricao:doc.toJSON().descricao,
          local_link:doc.toJSON().local_link,
          nome_grupo_publico:doc.toJSON().nome_grupo_publico,
          nome_faculdade:doc.toJSON().nome_faculdade,
          nome_curso:doc.toJSON().nome_curso,
          selected_heroi:doc.toJSON().selected_heroi,
          });
          this.setState({
            eventos: eventos.sort((a, b) => {
              return (a.data_evento<b.data_evento);
            }),
            loading: false,
          }); 
        });
    });

  }

  render() {
    const { currentUser } = this.state
    return (
        <View style={styles.container}>
            <Header searchBar rounded>
        <Item fixedLabel last > 
            <Input bordered placeholder='Filtro por nome do grupo' onChangeText={nome_grupo_filtro => this.setState({ nome_grupo_filtro })} value={this.state.nome_grupo_filtro}/>
            <Button onPress={this.handleFiltro}>
            <Icon name="ios-search" />
            </Button>
            </Item>
        </Header>
        <Header style={{color:'black',backgroundColor:'#0000EE',width:'100%'}} >
        <Button style={{backgroundColor:'#0000EE',width:'33%'}} vertical active onPress={() => this.props.navigation.navigate('Grupos_Publicos')}>
              <Text style={{fontSize: 12,color:'white'}}>GRUPOS PUBLICOS</Text>
            </Button>
            <Button vertical active style={{backgroundColor:'#0000EE',width:'33%'}} onPress={() => this.props.navigation.navigate('Eventos_Publicos')}>
              <Text style={{fontSize: 12,color:'white'}}>EVENTOS PUBLICOS</Text>
            </Button>
            <Button vertical active style={{backgroundColor:'#0000EE',width:'33%'}} onPress={() => this.props.navigation.navigate('Gerenciar_Eventos')}>       
              <Text style={{fontSize: 12,color:'white'}}>MEUS EVENTOS</Text>
            </Button>
        </Header>
          <Content>
        <FlatList
          data={this.state.eventos}
          renderItem={({ item}) => {
          return (
            <Card > 
             <Item header bordered >
                <Text selectable={true}  style={{fontSize: 18,color:'#4F4F4F'}}>{item.titulo}</Text>   
              </Item>    
            <Item>
            <Hyperlink linkStyle={ { color: '#2980b9', fontSize: 14 } }>
            <Text selectable={true}   style={{fontSize: 14,color:'#4F4F4F'}}>
            Criador: {item.nome_usuario}{'\n'}
            Quando: {item.horario}, {item.data_evento}{'\n'}
            Onde: {item.local_link}{'\n'}
            Convidados/Nome Grupo: {item.nome_grupo_publico}{'\n'}
            Descrição: {item.descricao}
            </Text>
            </Hyperlink>           
            </Item>
                
       
            </Card>);}}>
        </FlatList>
  
        </Content>
        </View>
    )
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#708090',
  },
  button: {
    height: 50,
    width: '25%',
    backgroundColor: '#708090',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    marginBottom: 20,
  },

  item: {
    alignItems: 'center',
    flexGrow: 1,
    margin: 4,
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#A461FD',
  },
  item2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 40,
    backgroundColor: '#A461FD',
    width: '80%',
    height: '10%',
    marginLeft: '10%',
  },
  texto: {
    color: '#DCF5F7',
    textAlign: 'center',
    fontSize: 55,
  },
  itemEmpty: {
    backgroundColor: 'transparent',
  },
  img: {
    width: 30,
    height: 30,
    resizeMode: 'center',
  },
});