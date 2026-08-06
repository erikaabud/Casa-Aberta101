const usuarioModel = require("../models/usuarioModel");

async function cadastrar(req, res) {

    const { nome_usuario, senha_usuario } = req.body;

    try {

        await usuarioModel.cadastrar(
            nome_usuario,
            senha_usuario
        );

        res.status(201).json({
            mensagem: "Usuário cadastrado!"
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: "Erro ao cadastrar."
        });

    }

}

module.exports = {
    cadastrar
};