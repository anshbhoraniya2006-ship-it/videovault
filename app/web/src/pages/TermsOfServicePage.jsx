import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { FileText } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - VideoVault</title>
        <meta name="description" content="View VideoVault's Terms of Service." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
              <p className="text-muted-foreground italic">Last Updated: April 2026</p>

              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p>Welcome to VideoVault. By accessing or using our application, you agree to comply with and be bound by these Terms of Service. If you do not agree with these terms, please do not use VideoVault.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
                <p>VideoVault is a personal media categorization tool. We provide a platform for users to paste third-party YouTube URLs, generate custom playlists, and write accompanying text notes to organize this external media. VideoVault does not host any video content natively on its servers; all embedded media is directly streamed via the official YouTube player.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. User Conduct</h2>
                <p>You are solely responsible for the content, URLs, and notes you store in VideoVault. You agree not to use the application to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Store links to illegal, harmful, or grossly offensive material.</li>
                  <li>Attempt to bypass or exploit the authentication systems of the platform.</li>
                  <li>Infringe upon the intellectual property rights of third parties.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
                <p>VideoVault claims no ownership over the YouTube media linked and embedded within the application. Videos presented via the platform are the property of their respective creators and YouTube/Google LLC. Use of VideoVault does not grant you the right to download or re-distribute copyrighted material.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Termination</h2>
                <p>We reserve the right to suspend or terminate your VideoVault account at any time, with or without notice, if we believe you are violating these Terms of Service.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">6. Limitations of Liability</h2>
                <p>VideoVault is provided "AS IS", without warranties of any kind. We do not guarantee arbitrary uptime, and we are not liable for any sudden loss of your saved playlists, links, or notes.</p>
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TermsOfServicePage;
