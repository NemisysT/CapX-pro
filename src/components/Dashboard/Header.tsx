import { User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-800">My App</h1>
      </div>
      <div className="flex items-center">
        <Link href='/user'>
          <a className="flex items-center p-2 rounded hover:bg-gray-100 transition duration-200">
            <User className="h-6 w-6 text-gray-600" />
          </a>
        </Link>
      </div>
    </header>
  );
}