const KEY = require('../../utils/env').apiKeyTmdb

const utils = require('../../utils/commons')
const codeStatus = require('../../utils/status')
const CATEGORY = 'Actors'

const request = require('./request')

const PATH_POPULAR = '/3/person/popular?api_key='
const PATH_SEARCH = '/3/search/person?api_key='

popular = (req, res) => {

    const options = {
        host: utils.HOST,
        path: PATH_POPULAR + KEY
    };

    const userId = req.query.userId
    request.waitData(CATEGORY, null, false, '', options, userId)
        .then(contents => {
            utils.requestJsonSuccess(res, codeStatus.OK, 'Actors found!', contents[0].concat(contents[1]))
        }).catch(err => {
        utils.requestJsonFailed(res, codeStatus.badRequest, err.message)
    })
}

search = (req, res) => {
    const options = {
        host: utils.HOST,
        path: PATH_SEARCH + KEY + "&query=" + (req.query.query).replace(/\s/g, '%20')
    };

    const userId = req.query.userId
    request.waitData(CATEGORY, null,true, req.query.query, options, userId)
        .then(contents => {
            utils.requestJsonSuccess(res, codeStatus.OK, 'Actors found!', contents[0].concat(contents[1]))
        }).catch(err => {
        utils.requestJsonFailed(res, codeStatus.badRequest, err.message)
    })
}

module.exports = {
    popular, search
}

