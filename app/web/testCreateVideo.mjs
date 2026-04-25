import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testVideo() {
    try {
        console.log('Authenticating...');
        const authData = await pb.collection('users').authWithPassword('test1777044294032@example.com', 'password123'); // From previous run
        console.log('Logged in as', authData.record.id);
        
        console.log('Testing create video...');
        const record = await pb.collection('videos').create({
            userId: authData.record.id,
            youtube_url: 'https://youtube.com/watch?v=12345',
            title: 'Test Video',
            description: 'desc',
            tags: 'test',
            thumbnail_url: 'http://img.youtube.com/vi/12345/0.jpg',
            view_count: 0,
            liked: false,
            notes: 'some notes'
        });
        console.log('Video created:', record.id);
    } catch (e) {
        console.log('Error creating video:', e.response?.data || e.message);
    }
}

testVideo();
