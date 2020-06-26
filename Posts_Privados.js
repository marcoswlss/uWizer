import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image,ScrollView,FlatList} from 'react-native'
import {Badge,Header,Input,Button, Icon, Content,Footer, FooterTab,Item,Form,Card,CardItem,Left,Right,Body,Thumbnail,HeaderTab} from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';
import {firebaseDatabase} from './config'

const pub_pub_root = firebaseDatabase.ref();
const pub_pub_ref = pub_pub_root.child('Publicacao_Grupo_Privado');
export default class Posts_Privados extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      usuario : [],
      texto_publicacao:'',
      nome_grupo:'',
      publicacao:[]
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

handleNovaPublicacao = (nome_usuario,nome_faculdade,nome_curso,selected_heroi,emailUsuario) => {
  const { texto_publicacao ,currentUser,data_atual} = this.state
  const { navigate } = this.props.navigation;
  if (texto_publicacao ==''){
    Toast.show('Um post precisa de um texto')
  }else{
    Toast.show('Postagem realizada com sucesso')
    pub_pub_ref.push({
      usuario: currentUser.uid,
      nome_grupo_privado : this.props.navigation.state.params.nome_grupo_privado,
      texto_publicacao : texto_publicacao,
      data_inclusao : data_atual,
      nome_usuario:nome_usuario,
      nome_faculdade:nome_faculdade,
      nome_curso:nome_curso,
      selected_heroi:selected_heroi,
      emailUsuario:emailUsuario,
      chave_seguranca:this.props.navigation.state.params.chave_seguranca
    });
  } 
  
}

  componentDidMount() {
    const { navigate } = this.props.navigation;
   this.props.navigation.state.params.nome_grupo_privado

    var that = this;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    that.setState({
      data_atual:
        date + '/' + month + '/' + year + ' ' + hours + ':' + min
    });

    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
   
    const rootUser = firebaseDatabase.ref('Users').orderByChild("idUsuario").equalTo(currentUser.uid);
    rootUser.on('value', (childSnapshot) => {
      const usuario = [];
      childSnapshot.forEach((doc) => {
        usuario.push({
          idUsuario: doc.toJSON().idUsuario,
          nome_usuario: doc.toJSON().nome_usuario,
          nome_faculdade: doc.toJSON().nome_faculdade,
          nome_curso: doc.toJSON().nome_curso,
          selected_heroi: doc.toJSON().selected_heroi,
          emailUsuario: doc.toJSON().emailUsuario,
          });
          this.setState({
            usuario: usuario.sort((a, b) => {
              return (a.idUsuario<b.idUsuario);
            }),
            loading: false,
          }); 
        });
    });

    const rootPub = firebaseDatabase.ref('Publicacao_Grupo_Privado').orderByChild("chave_seguranca").equalTo(this.props.navigation.state.params.chave_seguranca);
    rootPub.on('value', (childSnapshot) => {
      const publicacao = [];
      childSnapshot.forEach((doc) => {
        publicacao.push({
          usuario: doc.toJSON().usuario,
          texto_publicacao : doc.toJSON().texto_publicacao,
          data_inclusao : doc.toJSON().data_inclusao,
          nome_usuario:doc.toJSON().nome_usuario,
          nome_faculdade:doc.toJSON().nome_curso,
          nome_curso:doc.toJSON().nome_curso,
          selected_heroi:doc.toJSON().selected_heroi,
          emailUsuario:doc.toJSON().emailUsuario,
          });
          this.setState({
            publicacao: publicacao.sort((a, b) => {
              return (a.data_inclusao<b.data_inclusao);
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
        <Form>
        <Card>        
        <Item fixedLabel last > 
            <Input multiline={true} bordered placeholder='Texto da sua publicacao:' onChangeText={texto_publicacao => this.setState({ texto_publicacao })} value={this.state.texto_publicacao}/>
         </Item>   
        
            <FlatList
      data={this.state.usuario}
      renderItem={({item}) => {
    return (
      <Item body bordered >
      <Button block light style={{color:'black',backgroundColor:'#0000EE',width:'100%'}} onPress={() => this.handleNovaPublicacao(item.nome_usuario,item.nome_faculdade,item.nome_curso,item.selected_heroi,item.emailUsuario)}>
            <Text style={{color:'white',fontSize:20}}>Adicionar Post</Text>
            <Icon name="add" style={{color:'white'}}/>
            </Button>
      </Item>
      );}}>
      </FlatList>
      </Card>
      </Form>
      <ScrollView>

<FlatList
  data={this.state.publicacao}
  renderItem={({item}) => {
  return (
    <Card>
      <CardItem header bordered>
      <Left>
      <Thumbnail square small source={{uri:item.selected_heroi }} />
        <Body>
          <Text>{item.nome_usuario}</Text>
        </Body>
      </Left>
      </CardItem>
    <CardItem body bordered >
 
    <Text selectable={true}  style={{fontSize: 20,color:'#505050E'}}>{item.texto_publicacao}</Text>

    </CardItem>
    <CardItem>
      <Right>
        <Text style={{fontSize: 10,color:'#808080'}}>{item.data_inclusao}</Text>
      </Right>
    </CardItem>
    </Card>);}}>
</FlatList>
</ScrollView>
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
  btnPerfil: {
    height: 240,
    width: '100%',
    backgroundColor: '#0000EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
  },
});