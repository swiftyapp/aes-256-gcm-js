const test = require('tape')
const { encrypt, decrypt } = require('./index.js')

const secret = 'mysecretpassword'
const data = 'sensitive data to encrypt'

test('Encrypts and decrypts data', t => {
  t.plan(1)

  const encrypted = encrypt(data, secret)
  const decrypted = decrypt(encrypted, secret)

  t.equal(decrypted, data)
})

test('Encryption generates a different value each time', t => {
  t.plan(1)

  const encrypted1 = encrypt(data, secret)
  const encrypted2 = encrypt(data, secret)

  t.notEqual(encrypted1, encrypted2)
})

test('Encrypted data is a hex string', t => {
  t.plan(1)

  t.match(encrypt(data, secret), /^[0-9a-f]+$/)
})

test('Decrypts data encrypted with Dart', t => {
  t.plan(1)

  const encrypted = '0c8f8023a48d7684dc6f662a4e33d85fbcc9b5ab168e2d9c3bd4ce4e72a6eb8ea75d833e1ce7f0a0f5f24c234f6aaec9359c48577fcc8e82'
  t.equal(decrypt(encrypted, 'password'), 'Hello World!')
})

test('Throws an error if secret is not a string', t => {
  t.plan(4)

  t.throws(
    () => encrypt(data),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  )

  t.throws(
    () => encrypt(data, null),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  )
  t.throws(
    () => encrypt(data, 0),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  )

  t.throws(
    () => encrypt(data, {}),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  )
})

test('Throws an error if encryption value is not a string', t => {
  t.plan(3)

  t.throws(() => encrypt({}, secret), /Encryption error: data must be a string/)
  t.throws(() => encrypt(undefined, secret), /Encryption error: data must be a string/)
  t.throws(() => encrypt(null, secret), /Encryption error: data must be a string/)
})

test('Throws an error if decryption value is not a string', t => {
  t.plan(3)

  t.throws(() => decrypt({}, secret), /Encryption error: cipher text must be a string/)
  t.throws(() => decrypt(undefined, secret), /Encryption error: cipher text must be a string/)
  t.throws(() => decrypt(null, secret), /Encryption error: cipher text must be a string/)
})