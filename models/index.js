const mongoose = require('mongoose');
const uuid = require('uuid');
const bc = require('bcrypt-node');

const eventSchema = new mongoose.Schema({
    aggregate: String,
    aggregateId: mongoose.Schema.Types.ObjectId,
    data: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
});

const orgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false
    }
});

const siteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    coreVersion: {
        type: String,
        required: false,
        default: ""
    },
    plugins: {
        type: [],
        required: false,
        default: []
    },
    lastCheckin: {
        type: Date,
        required: false
    },
    knownVulnerabilities: {
        wordpress: {
            type: [],
            required: false,
            default: []
        },
        plugins: {
            type: [],
            required: false,
            default: []
        }
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false
    },
    token: {
        type: String,
        required: false,
        default: uuid.v4().replace(/-/g, '')
    }
});

const checkinSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: false,
        default: Date.now
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
        required: true
    },
    coreVersion: {
        type: String,
        required: true
    },
    plugins: {
        type: [],
        required: false,
        default: []
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mfa: {
        type: Boolean,
        required: false,
        default: false
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Organization'
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false
    }
});

userSchema.pre('save', function (next) {
    const self = this;
    if (self.isNew) {
        bc.hash(self.password, null, null, function (err, hash) {
            if (err) return next(new Error('Failed to hash password'));

            self.password = hash;
            next();
        });
    }
});

userSchema.methods.validatePassword = function (password, cb) {
    bc.compare(password, this.password, function (err, result) {
        if (err) return cb(new Error('Failed to compare passwords'));

        return cb(null, result);
    });
};

userSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.password;

        return ret;
    }
};

module.exports = {
    Event: mongoose.model('Event', eventSchema),
    Organization: mongoose.model('Organization', orgSchema),
    Site: mongoose.model('Site', siteSchema),
    Checkin: mongoose.model('Checkin', checkinSchema),
    User: mongoose.model('User', userSchema)
};
