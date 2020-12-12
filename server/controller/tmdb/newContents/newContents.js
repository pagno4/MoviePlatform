const rating = require('../rating/requests')
const NewContentsSchema = require('../../../model/newContents')

const utils = require('../../../utils/commons')
const codeStatus = require('../../../utils/status')

module.exports = {

    added: function (req, res) {

        let {_userId, category} = req.body

        if (category !== 'Actors') {
            /* Movies and tv */
            const {title, date, language, vote, img} = req.body

            // CREATE new contents document
            const newContents = new NewContentsSchema({
                category: category,
                title: title,
                date: new Date(date),
                language: language,
                vote: vote,
                _userId: _userId
            })

            newContents.save(function (err) {
                if (err) utils.requestJsonFailed(res, codeStatus.badRequest, err.message)
            })
            utils.requestJsonSuccess(res, codeStatus.OK, 'Content added.')

        } else {
            /* Actors */

            const {title, vote, department, img} = req.body

            // CREATE new contents document
            const newContents = new NewContentsSchema({
                category: category,
                _userId: _userId,
                title: title,
                department: department,
                vote: vote
            })

            newContents.save(function (err) {
                if (err) utils.requestJsonFailed(res, codeStatus.badRequest, err.message)
            })
            utils.requestJsonSuccess(res, codeStatus.OK, 'Content added.')
        }
    },

    searchContentToShow: async function(userId){
        NewContentsSchema.find().then(contents => {
            let allData = []
            let countData = 0
            contents.forEach(content => {
                rating.search(userId, content._id, content.category).then(value => {
                    content.rating = value
                    allData.push(content)
                    countData ++
                    if(countData === contents.length) return allData
                })
            })
        })
    }
}