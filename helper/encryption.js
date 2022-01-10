const crypto = require('crypto');
const { Buffer } = require('buffer');
const { ENCRYPTION_KEY: key, ENCRYPTION_IV: secretiv } = JSON.parse(process.env.ENCRYPTION);
const algorithm = "aes-256-cbc";

function encrypt(text) {
  if(typeof text === 'object'){
    text = JSON.stringify(text);
  }
  let keystring = crypto.createHash('sha256').update(String(key)).digest('hex').substr(0, 32);
  let ivv = crypto.createHash('sha256').update(String(secretiv)).digest('hex').substr(0, 16);

  const cipher = crypto.createCipheriv(algorithm, keystring, ivv);
  const encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
  return encrypted;
}


function decrypt(encrypted) {
  encrypted = encrypted ? encrypted.toString().replace(" ", "+"):"";
  try {
    let buff = Buffer.from(encrypted, 'base64');
    let text = buff.toString('ascii');

    let keystringBuffer = crypto.createHash('sha256').update(String(key)).digest('hex').substr(0, 32);
    let ivvBuffer = crypto.createHash('sha256').update(String(secretiv)).digest('hex').substr(0, 16);

    let decipherBuffer = crypto.createDecipheriv(algorithm, keystringBuffer, ivvBuffer)

    let decBuffer = decipherBuffer.update(text, "base64", 'utf8')
    decBuffer += decipherBuffer.final();
    return decBuffer;
  } catch {
    try {
      let keystring = crypto.createHash('sha256').update(String(key)).digest('hex').substr(0, 32);
      let ivv = crypto.createHash('sha256').update(String(secretiv)).digest('hex').substr(0, 16);

      let decipher = crypto.createDecipheriv(algorithm, keystring, ivv)

      let dec = decipher.update(encrypted, "base64", 'utf8')
      dec += decipher.final();
      // return dec
      try{
      return JSON.parse(dec);
      }
      catch{
        return dec;
      }
    } catch {
      return JSON.stringify(encrypted);
    }
  }
}

module.exports = {
  encrypt,
  decrypt
}