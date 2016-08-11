const mongoose = require('mongoose');
const uuid = require('uuid');

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

module.exports = {
    Event: mongoose.model('Event', eventSchema),
    Organization: mongoose.model('Organization', orgSchema),
    Site: mongoose.model('Site', siteSchema),
    Checkin: mongoose.model('Checkin', checkinSchema)
};
