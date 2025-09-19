import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about MyGrowVest, our mission, and how we help investors achieve their financial goals.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Basic About Page Content */}
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-white text-center mb-8">About MyGrowVest</h1>
        <div className="glass-card max-w-4xl mx-auto">
          <p className="text-white/80 text-lg leading-relaxed">
            MyGrowVest is a leading investment platform dedicated to helping individuals achieve financial freedom 
            through smart, secure, and profitable investment opportunities. Our mission is to democratize wealth 
            creation and provide everyone with access to premium investment strategies.
          </p>
        </div>
      </div>
    </div>
  );
}