# aes-256-gcm-js

AES 256 GCM encryption algorithm in JavaScript

## Use

```javascript
import { encrypt, decrypt } from "@swiftyapp/aes-256-gcm";

const encrypted = encrypt("some sensitive data", "password");
console.log(encrypted); // 79e103b37586b83002e92cc9...

const decrypted = decrypt(encrypted, "password");
console.log(decrypted); // some sensitive data
```
