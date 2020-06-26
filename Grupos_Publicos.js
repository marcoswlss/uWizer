import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image,ScrollView,FlatList} from 'react-native'
import {Badge,Header,Input,Button, Icon, Content,Footer, FooterTab,Item,Form,Card,CardItem,Left,Right,Body,Thumbnail,HeaderTab} from 'native-base'
import firebase from 'react-native-firebase';
import {firebaseDatabase} from './config'

const pub_pub_root = firebaseDatabase.ref();
const pub_pub_ref = pub_pub_root.child('Publicacao_Grupo_Publico');
export default class Grupos_Publicos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      usuario : [],
      texto_publicacao:'',
      nome_grupo:'',
      publicacao:[],
      nome_grupo_filtro:'',
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

handleFiltro = () => {
  const { nome_grupo_filtro} = this.state
  if(nome_grupo_filtro == ''){
    const rootPub = firebaseDatabase.ref('Publicacao_Grupo_Publico');
    rootPub.on('value', (childSnapshot) => {
      const publicacao = [];
      childSnapshot.forEach((doc) => {
        publicacao.push({
          usuario: doc.toJSON().usuario,
          nome_grupo_publico : doc.toJSON().nome_grupo_publico,
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
  }else{
    const rootPub = firebaseDatabase.ref('Publicacao_Grupo_Publico').orderByChild("nome_grupo_publico").equalTo(nome_grupo_filtro);
    rootPub.on('value', (childSnapshot) => {
      const publicacao = [];
      childSnapshot.forEach((doc) => {
        publicacao.push({
          usuario: doc.toJSON().usuario,
          nome_grupo_publico : doc.toJSON().nome_grupo_publico,
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
 
}

handleNovaPublicacao = (nome_usuario,nome_faculdade,nome_curso,selected_heroi,emailUsuario) => {
alert('Publicação realizada com sucesso')
  const { texto_publicacao ,nome_grupo,currentUser,data_atual} = this.state
  pub_pub_ref.push({
    usuario: currentUser.uid,
    nome_grupo_publico : nome_grupo,
    texto_publicacao : texto_publicacao,
    data_inclusao : data_atual,
    nome_usuario:nome_usuario,
    nome_faculdade:nome_faculdade,
    nome_curso:nome_curso,
    selected_heroi:selected_heroi,
    emailUsuario:emailUsuario,
  });
}

  componentDidMount() {

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

    const rootPub = firebaseDatabase.ref('Publicacao_Grupo_Publico');
    rootPub.on('value', (childSnapshot) => {
      const publicacao = [];
      childSnapshot.forEach((doc) => {
        publicacao.push({
          usuario: doc.toJSON().usuario,
          nome_grupo_publico : doc.toJSON().nome_grupo_publico,
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
        <Form>
        <Card>      
        <Item fixedLabel> 
            <Input multiline={true} bordered placeholder='Nome do Grupo:' onChangeText={nome_grupo => this.setState({ nome_grupo })} value={this.state.nome_grupo}/>
         </Item>   
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
          <Badge primary>
                  <Text note style={{color:'white'}}>Grupo: {item.nome_grupo_publico}</Text>
                  </Badge>
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