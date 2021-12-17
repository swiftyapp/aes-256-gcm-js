import test from 'tape'
import { encrypt, decrypt } from './index.js'

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

test('Throws an error if no secret given', t => {
  t.plan(4)

  t.throws(
    () => encrypt(data),
    /The "password" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, or DataView. Received undefined/
  )

  t.throws(
    () => encrypt(data, null),
    /The "password" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, or DataView. Received null/
  )
  t.throws(
    () => encrypt(data, 0),
    /The "password" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, or DataView. Received type number \(0\)/
  )

  t.throws(
    () => encrypt(data, {}),
    /The "password" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, or DataView. Received an instance of Object/
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