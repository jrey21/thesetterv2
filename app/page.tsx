'use client';

export default function Home() {
  const handleLogin = () => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;
    
    // UPDATED SCOPE: Removed "pages_manage_metadata"
    const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,instagram_manage_messages,pages_read_engagement,pages_show_list&response_type=code`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Setter App</h1>
        <button 
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Connect Instagram Business
        </button>
      </div>
    </div>
  );
}