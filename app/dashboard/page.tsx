// The "Mochi-Style" Instagram Link
const instagramLoginUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;

// Use this URL in your button:
// <a href={instagramLoginUrl}>Connect Instagram</a>