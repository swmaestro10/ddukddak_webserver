function eval_template(s, params) {

    return Function(...Object.keys(params), "return " + s)
    (...Object.values(params));

}

module.exports = {

    eval_template : eval_template,

};
