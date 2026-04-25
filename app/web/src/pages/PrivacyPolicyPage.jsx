import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - VideoVault</title>
        <meta name="description" content="View VideoVault's Privacy Policy." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
              <p className="text-muted-foreground italic">Last Updated: April 2026</p>

              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                <p>Welcome to VideoVault. We value your privacy. Because VideoVault acts as your personal library for saving YouTube links, playlists, and notes, the primary information we collect is the content you explicitly provide to us:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Account Data:</strong> We collect your email address and authentication credentials when you sign up.</li>
                  <li><strong>Your Library:</strong> Any YouTube video URLs, playlist URLs, descriptions, and written notes you save to your Dashboard.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p>We use the data you provide exclusively to power the VideoVault application experience. Specifically, we use your data to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Display and organize your video library safely.</li>
                  <li>Provide you with cross-device syncing of your notes and playlists.</li>
                  <li>Ensure your account remains secure.</li>
                </ul>
                <p className="mt-2 font-medium">We do not sell, rent, or trade your personal data or your video library contents to any third parties.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. Application Data & Third Parties</h2>
                <p>VideoVault utilizes embedded YouTube functionality to play videos directly within the app. By using this service, you are also bound by the Google Privacy Policy and YouTube Terms of Service. YouTube may gather telemetry data, analytics, or cookies when embedding their video players on this site.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
                <p>We securely host your data in encrypted databases. We utilize PocketBase to securely handle all user authentication securely and ensure your passwords are never stored in plain text.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
                <p>You own your data. You may delete individual videos, playlists, or notes using the application at any time. You may also contact us to request full deletion of your user account.</p>
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
