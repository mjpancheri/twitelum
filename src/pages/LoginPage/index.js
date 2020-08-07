import React, { Component, Fragment } from 'react'
import Cabecalho from '../../components/Cabecalho'
import Widget from '../../components/Widget'

import './loginPage.css'
import { NotificacaoContext } from '../../context/NotificacaoContext'
import { LoginService } from '../../services/LoginService'

const InputFormField = ({ id, label, errors, values, onChange, type = 'text' }) => {
    return (
        <div className="loginPage__inputWrap">
            <label className="loginPage__label" htmlFor={id}>{label}</label> 
            <input
                className="loginPage__input" 
                type={type}
                id={id}
                name={id}
                value={values[id]}
                onChange={onChange}
            />
            <p style={{ color: 'red' }}>{errors && errors[id]}</p>
        </div>
    )
};

class LoginPage extends Component {
    static contextType = NotificacaoContext;
    constructor() {
        super();
        this.state = {
            values: {
                inputLogin: '',
                inputSenha: ''
            },
            errors: {}
        };
    }

    formValidations = () => {
        const { inputLogin, inputSenha } = this.state.values;
        const errors = {};

        if(!inputLogin) errors.inputLogin = 'O campo login é obrigatório';
        if(!inputSenha) errors.inputSenha = 'O campo senha é obrigatório';

        this.setState({ errors });
    };

    onFormFieldChange = ({ target }) => {
        const value = target.value;
        const name = target.name;
        const values = { ...this.state.values, [name]: value};
        this.setState({ values }, () => {
            this.formValidations();
        });
    };

    fazerLogin = (event) => {
        event.preventDefault();
        
        const dadosLogin = {
            login: this.state.values.inputLogin,
            senha: this.state.values.inputSenha,
        }
        LoginService.logar(dadosLogin)
        .then(() => {
            this.context.setMsg(`Olá @${dadosLogin.login}! Bem vindo ao Twitelum, login foi um sucesso!`);
            this.props.history.push('/');
        })
        .catch(err => {
            //console.error(`[Erro ${err.status}]`, err.message);
            this.context.setMsg(`[Erro ${err.status}] ${err.message}`);
        })
    }

    render() {
        return (
            <Fragment>
                <Cabecalho />
                <div className="loginPage">
                    <div className="container">
                        <Widget>
                            <h2 className="loginPage__title">Seja bem vindo!</h2>
                            <form className="loginPage__form" action="/" onSubmit={this.fazerLogin}>
                                <InputFormField
                                    id="inputLogin"
                                    label="Login"
                                    onChange={this.onFormFieldChange}
                                    values={this.state.values}
                                    errors={this.state.errors}
                                />
                                <InputFormField
                                    id="inputSenha"
                                    label="Senha"
                                    type="password"
                                    onChange={this.onFormFieldChange}
                                    values={this.state.values}
                                    errors={this.state.errors}
                                />
                                {/* <div className="loginPage__errorBox">
                                    Mensagem de erro!
                                </div> */}
                                <div className="loginPage__inputWrap">
                                    <button className="loginPage__btnLogin" type="submit">
                                        Logar
                                    </button>
                                </div>
                            </form>
                        </Widget>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default LoginPage