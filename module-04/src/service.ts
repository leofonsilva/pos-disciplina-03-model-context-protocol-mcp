import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'node:crypto';

// Sal fixo usado para derivar a chave (não é secreto, apenas evita ataques com tabelas pré-computadas)
// O mesmo salt deve ser usado para criptografar e descriptografar
const SALT = 'mcp-encrypter-salt';

// Converte uma senha (passphrase) em uma chave de 32 bytes (256 bits) adequada para AES-256
// O scrypt é um algoritmo lento de propósito - dificulta ataques de força bruta
function deriveKey(passphrase: string): Buffer {
  // scryptSync(passphrase, salt, comprimentoDaChave)
  // O salt fixo + passphrase geram a mesma chave sempre que a passphrase for igual
  return scryptSync(passphrase, SALT, 32);
}

// CRIPTOGRAFAR: transforma texto legível em texto ilegível
export function encrypt(text: string, key: string): string {
  // Gera um IV (vetor de inicialização) aleatório de 16 bytes
  // O IV garante que a mesma mensagem criptografada duas vezes produza resultados diferentes
  // Isso protege contra ataques de padrão
  const iv = randomBytes(16);
  
  // Cria o objeto de criptografia usando:
  // - algoritmo: AES-256-CBC (padrão seguro e amplamente usado)
  // - chave: derivada da passphrase fornecida
  // - iv: aleatório (único para cada operação)
  const cipher = createCipheriv('aes-256-cbc', deriveKey(key), iv);
  
  // Executa a criptografia:
  // 1. cipher.update() criptografa o texto
  // 2. cipher.final() pega o último bloco (se houver)
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(text, 'utf8')),
    cipher.final(),
  ]);
  
  // Retorna no formato "IV:TextoCriptografado"
  // - IV em hexadecimal (32 caracteres, pois 16 bytes = 32 hex)
  // - Texto criptografado em hexadecimal
  // O dois pontos (:) é o separador usado depois para descriptografar
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// DESCRIPTOGRAFAR: reverte o processo, transformando texto ilegível de volta em legível
export function decrypt(encryptedText: string, key: string): string {
  // Divide a string no primeiro ":" para separar IV do texto criptografado
  // Usa rest para juntar caso o texto criptografado também contenha ":" (raro, mas seguro)
  const [ivHex, ...rest] = encryptedText.split(':');
  
  // Converte o IV de hexadecimal de volta para Buffer
  const iv = Buffer.from(ivHex, 'hex');
  
  // Junta as partes restantes e converte de hexadecimal para Buffer
  const encrypted = Buffer.from(rest.join(':'), 'hex');
  
  // Cria o objeto de descriptografia (usa o mesmo algoritmo, chave e IV)
  const decipher = createDecipheriv('aes-256-cbc', deriveKey(key), iv);
  
  // Executa a descriptografia:
  // 1. decipher.update() descriptografa os dados
  // 2. decipher.final() pega o último bloco
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  
  // Converte o resultado de volta para texto UTF-8
  return decrypted.toString('utf8');
}
