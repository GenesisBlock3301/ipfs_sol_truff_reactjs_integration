const IPFS = require("ipfs-api")

var ipfs = IPFS('127.0.0.1', '5001', {protocol: 'http'})

export default ipfs;