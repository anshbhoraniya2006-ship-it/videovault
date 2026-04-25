async function setup() {
  console.log("Authenticating as admin...");
  try {
    const authRes = await fetch('http://127.0.0.1:8090/api/admins/auth-with-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: 'admin@videovault.com', password: 'Admin12345!' })
    });
    const authData = await authRes.json();
    
    if (!authData.token) {
      console.error("Failed to authenticate:", authData);
      return;
    }
    const token = authData.token;
    console.log("Logged in. Creating videos collection...");

    const videosRes = await fetch('http://127.0.0.1:8090/api/collections', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: "videos",
        type: "base",
        schema: [
          { name: "userId", type: "text", required: true },
          { name: "youtube_url", type: "url", required: true },
          { name: "title", type: "text", required: true },
          { name: "description", type: "text" },
          { name: "tags", type: "text" },
          { name: "thumbnail_url", type: "url" },
          { name: "view_count", type: "number" }
        ],
        listRule: "userId = @request.auth.id",
        viewRule: "userId = @request.auth.id",
        createRule: "@request.auth.id != '' && userId = @request.auth.id",
        updateRule: "userId = @request.auth.id",
        deleteRule: "userId = @request.auth.id"
      })
    });
    console.log("Videos res:", await videosRes.json());

    console.log("Creating playlists collection...");
    const playlistsRes = await fetch('http://127.0.0.1:8090/api/collections', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: "playlists",
        type: "base",
        schema: [
          { name: "userId", type: "text", required: true },
          { name: "playlist_name", type: "text", required: true },
          { name: "description", type: "text" },
          { name: "videos", type: "text" }
        ],
        listRule: "userId = @request.auth.id",
        viewRule: "userId = @request.auth.id",
        createRule: "@request.auth.id != '' && userId = @request.auth.id",
        updateRule: "userId = @request.auth.id",
        deleteRule: "userId = @request.auth.id"
      })
    });
    console.log("Playlists res:", await playlistsRes.json());
    
    console.log("Database schema setup complete!");
  } catch (err) {
    console.error("Error:", err);
  }
}

setup();
