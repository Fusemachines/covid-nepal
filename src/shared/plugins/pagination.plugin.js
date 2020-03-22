var Promise = require('bluebird');

/**
 * @param {Object}              [query={}]
 * @param {Object}              [options={}]
 * @param {Object|String}         [options.select]
 * @param {Object|String}         [options.sort]
 * @param {Array|Object|String}   [options.populate]
 * @param {Boolean}               [options.lean=false]
 * @param {Boolean}               [options.leanWithId=true]
 * @param {Number}                [options.offset=0] - Use offset or page to set skip position
 * @param {Number}                [options.page=1]
 * @param {Number}                [options.limit=10]
 * @param {Function}            [callback]
 *
 * @returns {Promise}
 */
function paginate(condition, options, callback) {
    let query = condition || {};
    options = Object.assign({}, paginate.options, options);

    let select = options.select;
    let sort = options.sort;
    let populate = options.populate;
    let lean = options.lean || false;
    let leanWithId = options.hasOwnProperty('leanWithId') ? options.leanWithId : true;

    let limit = options.hasOwnProperty('limit') ? options.limit : false;
    let skip, offset, page;

    if (options.hasOwnProperty('offset')) {
        offset = options.offset;
        skip = offset;
    } else if (options.hasOwnProperty('page')) {
        page = options.page;
        skip = (page - 1) * limit;
    } else {
        offset = 0;
        page = 1;
        skip = offset;
    }

    let promises = {
        docs: Promise.resolve([]),
        count: this.countDocuments(query).exec()
    };


    query = this.find(condition)
        .select(select)
        .sort(sort)
        .skip(skip)

    if (limit) {
        query = query.limit(limit)
    }

    query = query.lean(lean);

    if (populate) {
        [].concat(populate).forEach(function (item) {
            query.populate(item);
        });
    }

    promises.docs = query.exec();

    if (lean && leanWithId) {
        promises.docs = promises.docs.then(function (docs) {
            docs.forEach(function (doc) {
                doc.id = String(doc._id);
            });

            return docs;
        });
    }


    return Promise.props(promises)
        .then(function (data) {
            let result = {
                docs: data.docs,
                total: data.count,
                size: limit || undefined
            };

            if (offset !== undefined && limit) {
                result.offset = offset;
            }

            if (page !== undefined) {
                result.page = limit ? page : undefined
                result.pages = limit ? Math.ceil(data.count / limit) || 1 : undefined
            }

            return result;
        })
        .asCallback(callback);
}

/**
 * @param {Schema} schema
 */
module.exports = function (schema) {
    schema.statics.paginate = paginate;
};


export default paginate;