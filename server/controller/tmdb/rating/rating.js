const RatingSchema = require('../../../model/rating')
const newContents = require('../../tmdb/newContents/newContents')
const requests = require('../rating/requests')

const KEY = require('../../../utils/env').apiKeyTmdb

const utils = require('../../../utils/commons')
const contents = require('../../../utils/contents')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

module.exports = {

    update: async function (req, res) {

        const {userId, contentId, category, value} = req.body.params
        if (!userId || !contentId || !category || !value)
            return res.status(404).json({
                success: false,
                message: 'Must pass params',
            })

        const updated = await RatingSchema.findOneAndUpdate(
            {'_userId': userId, 'content._contentId': contentId},
            {$set: {'content.$.value': value}})

        if (updated === null) {

            // Added content to document
            await RatingSchema.updateOne(
                {'_userId': userId},
                {
                    $push: {
                        content: {
                            category: category,
                            _contentId: contentId,
                            value: value
                        }
                    }
                })
            console.log("[CONTENT ADDED]")
            return res.status(200).json({
                success: true
            })
        } else {
            console.log("[CONTENT UPDATED]")
            return res.status(200).json({
                success: true
            })
        }
    },

    searchAll: async function (req, res) {

        const {userId, isMovies, isTvs, isActors} = req.query
        if (!userId || !isMovies || !isTvs || !isActors)
            return res.status(404).json({
                success: false,
                message: 'Must pass params',
            })

        const eqMovies = {$eq: ['$$item.category', isMovies === 'true' ? contents.MOVIES : '']} //todo aggiungere null
        const eqTvs = {$eq: ['$$item.category', isTvs === 'true' ? contents.PROGRAM_TV : '']}
        const eqActors = {$eq: ['$$item.category', isActors === 'true' ? contents.ACTORS : '']}

        let result = await RatingSchema.aggregate([

            {$match: {_userId: ObjectId(userId)}},
            {
                $project: {
                    content: {
                        $filter: {
                            input: '$content',
                            as: 'item',
                            cond: {
                                $or: [
                                    eqMovies,
                                    eqTvs,
                                    eqActors
                                ]
                            }
                        }
                    }
                }
            }
        ])

        this.result = result[0].content
        if (this.result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No contents found!',
            })
        } else {

            let allDataRating = []
            let countData = 0
            const promise = new Promise((resolve) => {
                this.result.forEach(content => {
                    newContents.searchContentRate(content._contentId, content.value).then(contentUser => {
                        if (contentUser.length !== 0) {
                            allDataRating.push(contentUser[0])
                            countData++
                            if (countData === this.result.length) resolve()
                        } else
                            getContentsRateTmdb(userId, content).then(contentTmdb => {
                                allDataRating.push(contentTmdb)
                                countData++
                                if (countData === this.result.length) resolve()
                            })
                        }
                    )
                })

            })
            promise.then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Contents found!',
                    data: allDataRating
                })
            })
        }
    },
}

function getContentsRateTmdb(userId, content) {

    let CATEGORY = ''
    let options = {}

    switch (content.category) {
        case contents.MOVIES:
            CATEGORY = contents.MOVIES
            options = {
                host: utils.HOST,
                path: '/3/movie/' + content._contentId + '?api_key=' + KEY
            };
            break;
        case contents.PROGRAM_TV:
            CATEGORY = contents.PROGRAM_TV
            options = {
                host: utils.HOST,
                path: '/3/tv/' + content._contentId + '?api_key=' + KEY
            };
            break;
        case contents.ACTORS:
            CATEGORY = contents.ACTORS
            options = {
                host: utils.HOST,
                path: '/3/person/' + content._contentId + '?api_key=' + KEY
            };
            break;
    }

    return new Promise(resolve => {
        requests.getDetails(options, userId, CATEGORY, obj => {
            if (Object.keys(obj).length !== 0) {
                resolve(obj)
            }
        })
    })
}

