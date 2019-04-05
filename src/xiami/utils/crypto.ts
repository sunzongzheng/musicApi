import crypto from 'crypto'

const Crypto = {
    MD5: function (text: string) {
        return crypto
            .createHash('md5')
            .update(text)
            .digest('hex')
    }
}

export default Crypto
