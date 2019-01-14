const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjId = mongoose.Types.ObjectId;
const ModelName = "Queue"

const objSchema = new Schema({
    
    location: {
        name: { type: String, required: true},
        lat: Number,
        long: Number
    },
    
    waitedTime: Number,
    estimatedTime: Number,
    
    startedAt: { type: Date, default: Date.now },
    endedAt: Date
});

objSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
objSchema.set('toJSON', {
    virtuals: true
});

objSchema.findById = function (cb) {
    return this.model(ModelName).find({ id: this.id }, cb);
};

const Model = mongoose.model(ModelName, objSchema);

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Model
            .findById(id)
            .exec((err, obj) => {
                if (err) return reject(err);
                if (!obj) return reject();
                obj = cleanObject(obj);
                return resolve(obj);
            })
    })
}

exports.create = (data) => {
    delete data.id;
    const obj = new Model(data);
    return obj.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Model.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, objs) {
                if (err) {
                    reject(err);
                } else {
                    objs = objs.map(cleanObject)
                    resolve(objs);
                }
            })
    });
};

exports.patch = (id, data) => {
    return new Promise((resolve, reject) => {
        Model.findById(id, function (err, obj) {
            if (err) return reject(err);
            if (!obj) return reject();
            for (let i in data) {
                obj[i] = data[i];
            }
            obj.save(function (err, updatedObj) {
                if (err) return reject(err);
                resolve(updatedObj);
            });
        });
    })

};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Model.findById(id, function (err, obj) {
            if (err) return reject(err);
            if (!obj) return reject();

            Model.remove({ _id: id }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    });
};

function cleanObject(obj) {
    obj = obj.toJSON()
    delete obj._id;
    delete obj.__v;
    return obj
}