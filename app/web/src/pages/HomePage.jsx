import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Video, Zap, Sparkles, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { motion } from 'framer-motion';
import CyberVaultScene from '@/components/CyberVaultScene.jsx';

const HomePage = () => {
  const features = [
    {
      icon: Video,
      title: 'Browse YouTube Videos',
      description: 'Quickly browse any YouTube video with automatic thumbnail and title extraction'
    },
    {
      icon: FolderOpen,
      title: 'Explore Playlists',
      description: 'Browse curated playlists and discover new content effortlessly'
    },
    {
      icon: Zap,
      title: 'Smart Organization',
      description: 'Videos are organized with custom playlists and tags for easy discovery'
    },
    {
      icon: Sparkles,
      title: 'Track Views',
      description: 'Monitor which videos you watch most and discover patterns'
    }
  ];

  return (
    <>
      <Helmet>
        <title>VideoVault - Your Personal YouTube Video Library</title>
        <meta name="description" content="Browse and explore your favorite YouTube videos in one place. Discover playlists, tags, and viewing history." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black/5 dark:bg-black/40">
            <CyberVaultScene />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <Video className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Your personal video library</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Browse and explore your favorite YouTube videos
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Explore your video collection with smart playlists, custom tags, and view tracking. Never lose track of that perfect tutorial again.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-shadow">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/playlists">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-md bg-background/30 border-primary/50">
                      Browse Playlists
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-card">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ textWrap: 'balance' }}>
                  Everything you need to explore your videos
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Simple tools to help you browse, organize, and rediscover your favorite content
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 }}
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-card/50 backdrop-blur-sm border-primary/10">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto text-center"
              >
                <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ textWrap: 'balance' }}>
                  Start exploring your video library today
                </h2>
                <p className="text-muted-foreground mb-8">
                  Jump into VideoVault and explore your YouTube video collection
                </p>
                <Link to="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default HomePage;