const Model = require("./model")
const { Message, Producer } = require('redis-smq');
const redisConfig = {
    namespace: 'app',
    redis: {
        host: 'redis',
        port: 6379,
        connect_timeout: 3600*1000,
    }
}
const producer = new Producer('main', redisConfig);

exports.insert = (req, res) => {
    console.log(req.body)
    Model.create(req.body)
        .then((result) => {
            
            const message = new Message();
            message
                .setBody(result)
                .setTTL(3600*1000)
                .setScheduledDelay(10);

            producer.produceMessage(message, (err) => {
                if (err) console.log(err);
            });

            res.status(201).json({ id: result._id });
        });
};

exports.list = (req, res) => {
    if (req.query) {
        var limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
        req.query.page = parseInt(req.query.page);
        var page = req.query.page && Number.isInteger(req.query.page) ? req.query.page : 0;
    }
    Model.list(limit, page)
        .then((result) => {
            res.status(200).json(result);
    })
};

exports.getById = (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch( (error) => {
            res.status(404).json({error: error})
        });
};

exports.patchById = (req, res) => {
    Model.patch(req.params.id, req.body)
        .then((result) => {
            res.status(204).json({});
        })
        .catch( (error) => {
            res.status(404).json({error: error})
        });
};

exports.removeById = (req, res) => {
    Model.removeById(req.params.id)
        .then((result) => {
            res.status(204).json({});
        })
        .catch( (error) => {
            res.status(404).json({error: error})
        });
};