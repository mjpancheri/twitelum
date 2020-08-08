import React, { Component, Fragment } from 'react'
import Cabecalho from '../../components/Cabecalho'
import Widget from '../../components/Widget'

import './loginPage.css'
import { NotificacaoContext } from '../../context/NotificacaoContext'
import { LoginService } from '../../services/LoginService'
import { FormManager } from '../../components/FormManager'

const InputFormField = ({ id, label, errors, touched, values, onChange, onBlur, type = 'text' }) => {
    const isTouched = Boolean(touched[id]);
    const hasErrors = Boolean(errors[id]);
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
                onBlur={onBlur}
            />
            <p style={{ color: 'red' }}>{isTouched && hasErrors && errors[id]}</p>
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

        if (!inputLogin) errors.inputLogin = 'O campo login é obrigatório';
        if (!inputSenha) errors.inputSenha = 'O campo senha é obrigatório';

        this.setState({ errors });
    };

    // onFormFieldChange = ({ target }) => {
    //     const value = target.value;
    //     const name = target.name;
    //     const values = { ...this.state.values, [name]: value };
    //     this.setState({ values }, () => {
    //         this.formValidations();
    //     });
    // };

    fazerLogin = (event, values) => {
        event.preventDefault();

        const dadosLogin = {
            login: values.inputLogin,
            senha: values.inputSenha,
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
                            <FormManager
                                initialValues={{ inputLogin: '', inputSenha: '' }}
                                onFormValidation={values => {
                                    const errors = {};

                                    if (!values.inputLogin) errors.inputLogin = 'O campo login é obrigatório';
                                    if (!values.inputSenha) errors.inputSenha = 'O campo senha é obrigatório';

                                    return errors;
                                }}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    onFormFieldChange,
                                    onFormFieldBlur
                                }) => (
                                <form 
                                    className="loginPage__form" 
                                    action="/" 
                                    onSubmit={event => this.fazerLogin(event, values)}
                                >
                                    <InputFormField
                                        id="inputLogin"
                                        label="Login"
                                        onChange={onFormFieldChange}
                                        onBlur={onFormFieldBlur}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <InputFormField
                                        id="inputSenha"
                                        label="Senha"
                                        type="password"
                                        onChange={onFormFieldChange}
                                        onBlur={onFormFieldBlur}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
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
                                )}
                            </FormManager>
                        </Widget>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default LoginPage