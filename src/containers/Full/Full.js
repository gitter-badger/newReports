import React, {Component, PureComponent} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';
import {ajaxRequest} from './../../utils/utils';
import {API} from './../../utils/api_paths';
import Conception from './../../views/Conception/Conception';
import ObjectPage from './../../views/ObjectPage/ObjectPage';

class Full extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : null,
            availableCities:[],
            userData:null,
            title:'',
            conceptions : [
                {
                    name: 'Главная',
                    full_name:'Главная',
                    url: '/dashboard',
                    icon: 'custom-icon-home',
                    badge: {
                        variant: 'info'
                    }
                }
            ]
        }
    }

    mobileSidebarToggle(e){
        //e.preventDefault();
        if(document.body.classList.contains('sidebar-mobile-show'))
            document.body.classList.remove('sidebar-mobile-show');
    }

    checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        ajaxRequest(API.auth,options)
            .then(data => {
                if(data.authorized)
                    this.setState({isLoggedIn:true})
                else
                    this.setState({isLoggedIn:false})
            })
            .catch(error => {
                console.log(error);
                this.setState({isLoggedIn:false});
            });
    }

    getUserData(){//парсинг пользовательских данных
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        ajaxRequest(API.userData,options)
            .then(data => this.setState({userData:data}))
            .catch(error => console.log(error));
    }

    receiveConceptionLists(){   //получаем список концепций для заполнения меню
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };

        function addIcon(item){
            if(item.id === 1)item.icon = 'custom-icon-traffic';
            if(item.name === 'Выручка внутренняя')item.icon = 'custom-icon-internal_revenue';
            if(item.name === 'Выручка внешняя')item.icon = 'custom-icon-external_revenue';
        }

        function editConceptionObject(item, parent){
            addIcon(item);//добавление иконки
            if(!parent){    //если нет родителя - даем иконку и базу для урла
                item.url = '/conceptions/' + item.id;
            }
            else{
                item.url = parent.url + '/' + item.id;
            }

            if(item.children)
                item.children.forEach( child => {
                    editConceptionObject(child,item)
                })
        }

        ajaxRequest(API.nav,options)
            .then(data => {
                let arr = this.state.conceptions;
                if(!Array.isArray(data))return;
                data.forEach( item => {
                    editConceptionObject(item)
                });
                this.setState({conceptions:arr.concat(data)},() => this.setTitle(this.state.conceptions) )   //после заполнения меню проверяем
                                                                                                            // находимся ли мы на одной из его ссылок и устанавливаем заголовок
            })
            .catch(err => console.log(err))
    }



    upState(name,value){
        this.setState({[name]:value})//обновляем стейт данными из дочерних компонентов
    }

    componentDidMount(){
        this.checkEitherLoggedInOrNot();//проверка авторизации
        this.receiveConceptionLists();//получаем список ссылок для бокового меню
        this.getUserData(); //парсинг пользовательских данных
        document.body.classList.add('sidebar-fixed'); //добавляем класс к body чтобы выровнять контентный блок
    }

    componentDidUpdate(){
        //this.checkEitherLoggedInOrNot();//проверка авторизации
    }

    componentWillUnmount(){
        document.body.classList.remove('sidebar-mobile-show'); //фикс бага с уходом контентной части вправо после логаута.
    }

    setTitle(arr){  //установка заголовка страницы
        console.log(arr);
        let url = window.location.href;
        let idPosition = url.lastIndexOf('#');
        let conceptionURL = url.slice(idPosition+1);


        let title = this.state.title;
        function findTitle(arr){
             arr.forEach( item => {
                if(item.url === conceptionURL)title = item.full_name; //если адрес текущей ссылки в браузере совпадает с любой ссылкой из концепций -
                else{                                                               // устанавливаем концепцию как заголовок
                    if(item.children){
                        findTitle(item.children)
                    }
                }
            })
        }

        findTitle(arr);

        this.setState({title:title});
    }

    componentWillReceiveProps(nextProps){
        if(this.state.conceptions){
            this.setTitle(this.state.conceptions)
        }
    }




    render() {
        return (
            <div className="app">
                <Header
                    availableCities={this.state.availableCities}
                    conceptions={this.state.conceptions}
                    title={this.state.title}
                    address={this.state.address}
                    upState={this.upState.bind(this)}
                    {...this.props}
                />
                <div className="app-body">
                    <Sidebar
                        conceptions={this.state.conceptions}
                        userData={this.state.userData}
                        isLoggedIn={this.state.isLoggedIn}
                        {...this.props}
                    />
                    <main className="main" onClick={this.mobileSidebarToggle}>
                        <Container fluid>
                            <Switch>
                                <Route path="/dashboard" name="Dashboard" render={(props) =>
                                    <Dashboard cities={this.state.availableCities} upState={this.upState.bind(this)} {...props}/>}
                                />
                                <Route exact path="/conceptions/:id"  name="Conception"
                                       render={(props) =>
                                           <Conception cities={this.state.availableCities}  upState={this.upState.bind(this)} {...props} />
                                       }
                                />
                                <Route exact path="/conceptions/(.*)/:id"  name="Conception"
                                       render={(props) =>
                                           <Conception cities={this.state.availableCities}  upState={this.upState.bind(this)} {...props} />
                                       }
                                />
                                <Route exact path="/conceptions/(.*)/:id/:child"  name="Conception"
                                       render={(props) =>
                                           <Conception cities={this.state.availableCities}  upState={this.upState.bind(this)} {...props} />
                                       }
                                />
                                <Route path="/concept:concept/city:city/object:id" name="object"
                                       render={(props) =>
                                           <ObjectPage upState={this.upState.bind(this)} {...props} />
                                       }
                                />
                                <Redirect from="/" to="/dashboard"/>
                            </Switch>
                        </Container>
                    </main>
                    <Aside/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Full;
