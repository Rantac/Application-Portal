
import { redirect } from 'next/navigation';

export default function AdminLoginRedirectPage() {
  redirect('/');
  // This component will not render anything as redirect happens on the server.
  // return null; // Or an empty fragment, though redirect should prevent rendering.
}
