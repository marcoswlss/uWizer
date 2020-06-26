import React from 'react'
import { StyleSheet, Platform, Image, Text, View,ScrollView,TouchableOpacity,FlatList } from 'react-native'
import {Badge,Header,Input,Button,Body, Icon, Content,Footer, FooterTab,Card,CardItem,Thumbnail,Right,Left,Container,Form,Item,Picker, Textarea} from 'native-base'
import Hyperlink from 'react-native-hyperlink'
import {firebaseDatabase} from './config'
import firebase from 'react-native-firebase';

const post_root = firebaseDatabase.ref();
const post_ref = post_root.child('post');

export default class Main extends React.Component {
  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      categoria:'',
      texto_post:'',
      data_atual:'',
      usuario : [],
      posts: [],
      categoria_pesquisa:'',
      semaforo:'0'
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

  onValueChange(value) {
    this.setState({
      categoria: value
    });
  }

  onValueChange1(value) {
    this.setState({
      categoria_pesquisa: value
    });
  }

  handleNovoPost = (nome_usuario,nome_faculdade,nome_curso,selected_heroi,emailUsuario) => {

    const { categoria ,texto_post,currentUser,data_atual} = this.state
    post_ref.push({
      usuario: currentUser.uid,
      categoria : categoria,
      texto_post : texto_post,
      data_inclusao : data_atual,
      nome_usuario:nome_usuario,
      nome_faculdade:nome_faculdade,
      nome_curso:nome_curso,
      selected_heroi:selected_heroi,
      emailUsuario:emailUsuario,
    });
  }

  handleFiltro = () => {
    const { categoria_pesquisa} = this.state
    if(categoria_pesquisa == 'Sem Filtro'){
      const rootPosts = firebaseDatabase.ref('post');
      rootPosts.on('value', (childSnapshot) => {
        const posts = [];
        childSnapshot.forEach((doc) => {
          posts.push({
            usuario: doc.toJSON().usuario,
            categoria : doc.toJSON().categoria,
            texto_post : doc.toJSON().texto_post,
            data_inclusao : doc.toJSON().data_inclusao,
            nome_usuario:doc.toJSON().nome_usuario,
            nome_faculdade:doc.toJSON().nome_curso,
            nome_curso:doc.toJSON().nome_curso,
            selected_heroi:doc.toJSON().selected_heroi,
            emailUsuario:doc.toJSON().emailUsuario,
            });
            this.setState({
              posts: posts.sort((a, b) => {
                return (a.data_inclusao<b.data_inclusao);
              }),
              loading: false,
            }); 
          });
      });
    }else{
      const rootPosts = firebaseDatabase.ref('post').orderByChild("categoria").equalTo(categoria_pesquisa);
      rootPosts.on('value', (childSnapshot) => {
        const posts = [];
        childSnapshot.forEach((doc) => {
          posts.push({
            usuario: doc.toJSON().usuario,
            categoria : doc.toJSON().categoria,
            texto_post : doc.toJSON().texto_post,
            data_inclusao : doc.toJSON().data_inclusao,
            nome_usuario:doc.toJSON().nome_usuario,
            nome_faculdade:doc.toJSON().nome_curso,
            nome_curso:doc.toJSON().nome_curso,
            selected_heroi:doc.toJSON().selected_heroi,
            emailUsuario:doc.toJSON().emailUsuario,
            });
            this.setState({
              posts: posts.sort((a, b) => {
                return (a.data_inclusao<b.data_inclusao);
              }),
              loading: false,
            }); 
          });
      });
    }
   
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
    this.setState({ currentUser})

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


    const rootPosts = firebaseDatabase.ref('post');
    rootPosts.on('value', (childSnapshot) => {
      const posts = [];
      childSnapshot.forEach((doc) => {
        posts.push({
          usuario: doc.toJSON().usuario,
          categoria : doc.toJSON().categoria,
          texto_post : doc.toJSON().texto_post,
          data_inclusao : doc.toJSON().data_inclusao,
          nome_usuario:doc.toJSON().nome_usuario,
          nome_faculdade:doc.toJSON().nome_curso,
          nome_curso:doc.toJSON().nome_curso,
          selected_heroi:doc.toJSON().selected_heroi,
          emailUsuario:doc.toJSON().emailUsuario,
          });
          this.setState({
            posts: posts.sort((a, b) => {
              return (a.data_inclusao<b.data_inclusao);
            }),
            loading: false,
          }); 
        });
    });


    }
  

  render() {
    const { currentUser} = this.state

    return (
      <Container style={styles.container}>
        <Header searchBar rounded>
        <Item fixedLabel last > 
            <Text styles={backgroundColor='white'}>Filtre por assunto:</Text>
            <Picker  mode="dropdown"
              iosHeader="Selecionar"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.categoria_pesquisa}
              onValueChange={this.onValueChange1.bind(this)}  >
              <Picker.Item label="Sem Filtro" value="Sem Filtro"/>
              <Picker.Item label="Tecnologia da informação" value="Tecnologia da informação" />
              <Picker.Item label="Letras" value="Letras" />
              <Picker.Item label="Medicina" value="Medicina"/>
              <Picker.Item label="Biologia" value="Biologia"/>
              <Picker.Item label="Matemática" value="Matemática"/>
              <Picker.Item label="Odontologia" value="Odontologia"/>
            </Picker>
            <Button onPress={this.handleFiltro}>
            <Icon name="ios-search" />
            </Button>
            
            </Item>
        </Header>
       <Content>
         <Form>
       <FlatList
          data={this.state.usuario}
          renderItem={({item}) => {
          return (
            <Card>
               <CardItem>
              <Left>
              <Thumbnail medium source={{uri: item.selected_heroi}} />
                <Body>
                  <Text style={styles.texto}>{item.nome_usuario}</Text>
                  <Text style={{ marginLeft: 10 }} note> {item.nome_curso} </Text>
                  <TouchableOpacity style={styles.btnPerfil} onPress={() => this.props.navigation.navigate('Perfil')}>
                <Text style={{ color: 'white' }}>Editar perfil</Text>
              </TouchableOpacity>
                </Body>
              </Left>
            </CardItem>
        <Button block light style={{color:'black',backgroundColor:'#0000EE'}} onPress={() => this.handleNovoPost(item.nome_usuario,item.nome_faculdade,item.nome_curso,item.selected_heroi,item.emailUsuario)}>
            <Text style={{color:'white',fontSize:20}}>Adicionar Post</Text>
            <Icon name="add" style={{color:'white'}}/>
            
        </Button>
        </Card>);}}>
        </FlatList>
        <Card>
        <Item fixedLabel last > 
            <Text styles={backgroundColor='white'}>Assunto</Text>
            <Picker  mode="dropdown"
              iosHeader="Selecionar"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.categoria}
              onValueChange={this.onValueChange.bind(this)}  >
              <Picker.Item label="Selecione" value="Selecione"/>
              <Picker.Item label="Tecnologia da informação" value="Tecnologia da informação" />
              <Picker.Item label="Letras" value="Letras" />
              <Picker.Item label="Medicina" value="Medicina"/>
              <Picker.Item label="Biologia" value="Biologia"/>
              <Picker.Item label="Matemática" value="Matemática"/>
              <Picker.Item label="Odontologia" value="Odontologia"/>
            </Picker>
            </Item>
            <Input multiline={true} bordered placeholder='O que você está estudando?'  onChangeText={texto_post => this.setState({ texto_post })} value={this.state.texto_post} />
            </Card>
        </Form>
        <ScrollView>

        <FlatList
          data={this.state.posts}
          renderItem={({item}) => {
          return (
            <Card>
              <CardItem header bordered>
              <Left>
              <Thumbnail square small source={{uri:item.selected_heroi }} />
                <Body>
                  <Text> Usuario: {item.nome_usuario}{'\n'}Curso: {item.nome_faculdade} </Text>
                  <Badge primary>
                  <Text note style={{color:'white'}}>{item.categoria}</Text>
                  </Badge>
                </Body>
              </Left>
              </CardItem>
            <CardItem body bordered >
         
            <Text selectable={true}  style={{fontSize: 20,color:'#505050E'}}>{item.texto_post}</Text>
  
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
        <Footer>
          <FooterTab>
            <Button vertical active onPress={() => this.props.navigation.navigate('Main')}>
              <Icon name="grid" />
              <Text style={{fontSize: 12,color:'white'}}>Feed</Text>
            </Button>
            <Button vertical active onPress={() => this.props.navigation.navigate('Perfil')}>
              <Icon name="person" />
              <Text style={{fontSize: 12,color:'white'}}>Perfil</Text>
            </Button>
            <Button vertical active onPress={() => this.props.navigation.navigate('Grupos')}>
              <Icon active name="contacts" />
              <Text style={{fontSize: 12,color:'white'}}>Grupos</Text>
            </Button>
            <Button vertical active  onPress={() => this.props.navigation.navigate('Anotacoes')} >
              <Icon name="bookmarks" />
              <Text style={{fontSize: 12,color:'white'}}>Estudos</Text>
            </Button>
          </FooterTab>
        </Footer>
        </Container>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    height:100
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
  perfilImg: {
    width: 80,
    height: 80,
    resizeMode: 'center',
    borderRadius: 80 / 2,
  },
  texto: {
    color: 'black',
    marginBottom: 10,
    fontSize: 20,
  },
  perfil: {
    alignItems: 'center',
    marginTop: 50,
    borderWidth: 3,
    height: '20%',
    width: '80%',
  },
  btnPerfil: {
    height: 50,
    width: '40%',
    backgroundColor: '#0000EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
  },
});