'use client';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
//import { auth, provider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();

  /*const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email && email.endsWith('@seplag.ce.gov.br')) {
        router.push('/dashboard');
      } else {
        alert('Apenas emails seplag.ce.gov.br são permitidos.');
        auth.signOut();
      }
    } catch (error) {
      alert('Erro ao fazer login.');
      console.error(error);
    }
  };*/

  return (
    <div className="flex h-screen w-screen">
      {/* Lado esquerdo com fundo */}
      <div className="w-[60%] bg-green-900 relative flex items-center justify-center flex-col">
        <img src="/logo_seplag.png" alt="Logo Seplag" className="w-160 h-auto" />
        <a className='text-white text-2xl font-semibold font-montserrat'>COMPLI.ANCE</a>
      </div>

      {/* Lado direito vazio ou decorativo */}
      <div className="w-[40%] bg-gray-100">
        <div className="flex flex-col w-10/10 items-center justify-center h-screen">
            <a className='text-3xl font-semibold'>Login</a>
            <button   /*onClick={handleGoogleLogin}*/ className="w-6/10 bg-green-700 text-white p-2 rounded hover:bg-green-800  hover:cursor-pointer transition">Entrar com Google</button>
        </div>
        
      </div>
    </div>
  );
}
