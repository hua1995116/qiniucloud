function respSuccess (msg) {
    return {
        code: 200,
        msg
    }
}

function respFail(msg) {
    return {
        code: 500,
        msg
    }
}

module.exports = {
    respSuccess,
    respFail
}