import { useAuth } from '../context/AuthContext';
import FocusScore from '../components/FocusScore';

export default function Dashboard() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // clears auth state
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Dashboard!</h1>
      <p>This is your study tracker dashboard.</p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FocusScore score={85} distractedTime="15 mins" />
      </div>
    </div>
  );
}
