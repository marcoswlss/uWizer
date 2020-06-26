import React from 'react'
import { StyleSheet, Platform, Image, Text, View,ScrollView,TouchableOpacity,FlatList } from 'react-native'
import {Header,Input,Button,Body, Icon, Content,Footer, FooterTab,Card,CardItem,Thumbnail,Right,Left,Container,Form,Item,Picker, Textarea} from 'native-base'
import Hyperlink from 'react-native-hyperlink'
import {firebaseDatabase} from './config'
import firebase from 'react-native-firebase';
export default class Eventos_Privados extends React.Component {

  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      eventos:[]
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};
 
  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_privado
    this.props.navigation.state.params.chave_seguranca
  
      const rootPub = firebaseDatabase.ref('Eventos_Privados').orderByChild("chave_seguranca").equalTo(this.props.navigation.state.params.chave_seguranca);
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
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_privado
    this.props.navigation.state.params.chave_seguranca

    return (
        <View style={styles.container}>
            <Header style={{color:'black',backgroundColor:'#0000EE',width:'100%'}} >
              <Text style={{fontSize: 25,color:'white'}}>{this.props.navigation.state.params.nome_grupo_privado}</Text>  
        </Header>
        <Header style={{color:'black',backgroundColor:'#0000EE',width:'100%'}} >
        <Button vertical active style={{backgroundColor:'#0000EE',width:'25%'}} onPress={() => this.props.navigation.navigate('Posts_Privados',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>
              <Text style={{fontSize: 12,color:'white'}}>POSTS</Text>
            </Button>
        <Button style={{backgroundColor:'#0000EE',width:'33%'}} vertical active onPress={() => this.props.navigation.navigate('Gerenciar_Membros',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>
              <Text style={{fontSize: 12,color:'white'}}>GERENCIAR MEMBROS</Text>
            </Button>

            <Button vertical active style={{backgroundColor:'#0000EE',width:'25%'}} onPress={() => this.props.navigation.navigate('Eventos_Privados',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>       
              <Text style={{fontSize: 12,color:'white'}}>EVENTOS</Text>
            </Button>
            <Button vertical active style={{backgroundColor:'#0000EE',width:'25%'}} onPress={() => this.props.navigation.navigate('Meus_Eventos',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>       
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