import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testAuth() {
    try {
        const email = 'test' + Date.now() + '@example.com';
        console.log('Testing signup with email:', email);
        const record = await pb.collection('users').create({
            email: email,
            password: 'password123',
            passwordConfirm: 'password123',
            name: 'Test User'
        });
        console.log('Signup success:', record.id);
        
        console.log('Testing login...');
        const authData = await pb.collection('users').authWithPassword(email, 'password123');
        console.log('Login success! User ID:', authData.record.id);
    } catch (e) {
        console.log('Error:', e.response?.data || e.message);
    }
}

testAuth();
