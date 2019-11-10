function makeTemplate(string) {

    return "`" + string + "`"

}

function evalTemplate(s, params) {

    return Function(...Object.keys(params), "return " + s)
    (...Object.values(params));

}

module.exports = {

    makeTemplate : makeTemplate,
    evalTemplate : evalTemplate

};
