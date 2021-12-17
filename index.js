import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_ALGORITHM = 'sha512'
const SALT_LENGTH = 16
const IV_LENGTH = 12
const TAG_LENGTH = 16
const KEY_LENGTH = 32
const KEY_ITERATIONS_COUNT = 10000

export const encrypt = (cleartext, password, encoding = 'hex') => {
  if (typeof cleartext !== 'string')
    throw new TypeError('Encryption error: data must be a string')

  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = pbkdf2(password, salt)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(String(cleartext), 'utf8'),
    cipher.final()
  ])

  const tag = cipher.getAuthTag()

  return Buffer.concat([salt, iv, encrypted, tag]).toString(encoding)
}

export const decrypt = (ciphertext, password, encoding = 'hex') => {
  if (typeof ciphertext !== 'string')
    throw new TypeError('Encryption error: cipher text must be a string')

  const buffer = Buffer.from(String(ciphertext), encoding)
  const salt = buffer.slice(0, SALT_LENGTH)
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  const tag = buffer.slice(-TAG_LENGTH)
  const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH, -TAG_LENGTH)

  const key = pbkdf2(password, salt)

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  decipher.setAuthTag(tag)

  let cleartext = decipher.update(encrypted, 'hex', 'utf8')
  cleartext += decipher.final('utf8')

  return cleartext
}

const pbkdf2 = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, KEY_ITERATIONS_COUNT, KEY_LENGTH, KEY_ALGORITHM)
}
