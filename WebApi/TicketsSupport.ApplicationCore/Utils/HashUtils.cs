using Konscious.Security.Cryptography;
using System.Security.Cryptography;
using System.Text;

namespace TicketsSupport.ApplicationCore.Utils
{
    public class HashUtils
    {
        private static int iterations = 5; // Número de iteraciones 
        private static int memcost = 8192; // Costo de memoria (KiB). Incrementar esto hace el proceso más lento
        private static int par = 1; // Grado de parallelismo (núcleos CPU a utilizar)  
        private static int digest = 32; // Largo del resumen para el hash y salt generado (bytes)

        public static (string hashedPassword, string salt) HashPassword(string password)
        {
            // Generar una sal aleatoria
            byte[] salt = GenerateRandomSalt();

            // Hash de la contraseña usando Argon2id
            string hashedPassword = Argon2Hash(password, salt);

            // Convertir la sal a string para almacenar
            string saltString = Convert.ToBase64String(salt);

            return (hashedPassword, saltString);
        }

        public static bool VerifyPassword(string password, string hashedPassword, string salt)
        {
            // Convert salt Base64 To bytes
            byte[] saltBytes = Convert.FromBase64String(salt);

            // Hash password
            string computedHash = Argon2Hash(password, saltBytes);

            // compare password
            return hashedPassword.Equals(computedHash);
        }

        private static byte[] GenerateRandomSalt()
        {
            byte[] salt = new byte[digest];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            return salt;
        }

        private static string Argon2Hash(string password, byte[] salt)
        {
            //PASSWORD TO BYTE
            var bytes = Encoding.UTF8.GetBytes(password);

            //ARGON2 HASH
            var argon2 = new Argon2id(bytes);
            argon2.Salt = salt;
            argon2.DegreeOfParallelism = par;
            argon2.Iterations = iterations;
            argon2.MemorySize = memcost;

            //GET BYTES
            byte[] hashed = argon2.GetBytes(digest);

            return Convert.ToBase64String(hashed);
        }
    }
}
