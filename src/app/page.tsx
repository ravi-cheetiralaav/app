import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Image
                src="/logo.jpg"
                alt="TKFC Logo"
                width={120}
                height={120}
                className="rounded-3xl shadow-kid-friendly animate-gentle-bounce"
                priority
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center animate-pulse">
                <span className="text-lg">🎉</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to{" "}
            <span className="text-primary-500 animate-pulse">TKFC</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            🍎 A fun holiday food & beverage ordering experience 🥤
            <br />
            <span className="text-lg text-primary-600 font-semibold">
              Run by kids, loved by the community! 💚
            </span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            emoji="🛒"
            title="Easy Ordering"
            description="Browse our delicious menu and place your orders with just a few taps!"
            color="bg-accent-orange"
          />
          <FeatureCard
            emoji="📱"
            title="QR Code Pickup"
            description="Get a special QR code for quick and easy pickup on event day!"
            color="bg-accent-pink"
          />
          <FeatureCard
            emoji="🌟"
            title="Kid-Friendly"
            description="Managed by kids to learn business skills while serving the community!"
            color="bg-accent-purple"
          />
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-3xl p-12 shadow-kid-friendly">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Order? 🎯
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Log in to browse our amazing menu and place your order!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="btn-primary inline-block text-center"
            >
              🚀 Login to Order
            </Link>
            
            <Link
              href="/menu"
              className="btn-secondary inline-block text-center"
            >
              👀 Browse Menu
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <InfoCard
            title="How It Works"
            items={[
              "🔑 Log in with your User ID",
              "🍕 Browse our tasty menu items", 
              "🛒 Add items to your cart",
              "📅 Place order before cutoff date",
              "📱 Get QR code confirmation",
              "🎉 Pick up on event day!"
            ]}
          />
          
          <InfoCard
            title="What Makes Us Special"
            items={[
              "🧒 Run entirely by kids",
              "💚 Focus on healthy options",
              "🏠 Serving our local community",
              "📚 Educational business experience",
              "💰 Cash on pickup - no hidden fees",
              "🌟 Fresh, quality ingredients"
            ]}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-primary-500 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">TKFC</h3>
            <p className="text-primary-100">
              Teaching Kids Food & Customer service 👦👧
            </p>
          </div>
          
          <div className="text-primary-200 text-sm">
            <p>Made with ❤️ by kids, for the community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ emoji, title, description, color }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-kid-friendly transition-all duration-300 hover:-translate-y-2 group">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:animate-wiggle`}>
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  items: string[];
}

function InfoCard({ title, items }: InfoCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="text-gray-600 text-lg">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
