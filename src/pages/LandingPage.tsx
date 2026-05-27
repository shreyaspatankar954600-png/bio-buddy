import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Zap, FileText, Sparkles, Check, Gauge, Smile, RefreshCw, Lock, Drama, Ruler } from "lucide-react";
import ScrollCanvas from "@/components/ScrollCanvas";
import FloatingParticles from "@/components/FloatingParticles";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";

const NavBar = () => (
  <nav className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-border/40">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <Zap className="w-5 h-5 text-primary fill-primary" />
        <span className="font-extrabold text-foreground">BioDraft</span>
      </Link>
      <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
        <a href="#reviews" className="hover:text-foreground transition-colors">Reviews</a>
      </div>
      <Link
        to="/app"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
      >
        Generate Free <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </nav>
);

const Step = ({ n, icon: Icon, title, desc }: { n: number; icon: any; title: string; desc: string }) => (
  <div className="glass rounded-2xl p-6 relative hover:-translate-y-1 transition-transform duration-300 hover:border-primary/40">
    <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/30">
      {n}
    </div>
    <Icon className="w-8 h-8 text-primary mb-4" />
    <h3 className="font-bold text-lg text-foreground mb-1.5">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const FEATURES = [
  { icon: Zap, title: "Lightning Fast", desc: "Bios in under 10 seconds" },
  { icon: Drama, title: "5 Tone Options", desc: "Professional, Casual, Funny, Inspirational, Gen Z" },
  { icon: Ruler, title: "Length Control", desc: "Short, Medium or Long — you choose" },
  { icon: Smile, title: "Emoji Toggle", desc: "With or without emojis, your call" },
  { icon: RefreshCw, title: "Regenerate", desc: "Regenerate any single bio instantly" },
  { icon: Lock, title: "No Signup", desc: "No account needed. Ever." },
];

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles platform="instagram" />
      <NavBar />

      {/* Hero with ScrollCanvas */}
      <section className="relative">
        <ScrollCanvas>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            Generate scroll-stopping bios in seconds
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Three AI-crafted bios for Instagram and LinkedIn. Free. No signup.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-primary to-purple-500 hover:scale-[1.03] transition-transform shadow-xl shadow-primary/40"
          >
            Generate My Bio Free <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollCanvas>
        <div className="flex justify-center -mt-12 relative z-10 pointer-events-none">
          <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </div>
      </section>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-24 sm:space-y-32 py-20">
        {/* How It Works */}
        <section id="how" className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold">How it works</h2>
            <p className="text-muted-foreground">From blank profile to live bio in 3 steps.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Step n={1} icon={FileText} title="Fill your details" desc="Name, role, tone. Takes 30 seconds." />
            <Step n={2} icon={Sparkles} title="AI generates 3 bios" desc="Three unique variations, tailored to your platform." />
            <Step n={3} icon={Check} title="Copy and go live" desc="Paste directly into Instagram or LinkedIn." />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Everything you need</h2>
            <p className="text-muted-foreground">Built to make your profile pop, fast.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-5 hover:border-primary/50 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.5)] transition-all"
              >
                <f.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Showcase */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Built for every platform</h2>
            <p className="text-muted-foreground">Switch between Instagram and LinkedIn with one click.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Instagram phone mockup */}
            <div className="flex justify-center">
              <div className="w-[280px] rounded-[2.5rem] bg-neutral-900 border-[10px] border-neutral-800 shadow-2xl shadow-primary/20 overflow-hidden">
                <div className="h-5 bg-black flex items-center justify-center">
                  <div className="w-16 h-1 bg-neutral-700 rounded-full" />
                </div>
                <div className="bg-black p-4 space-y-3 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-400 p-[2px]">
                      <div className="w-full h-full rounded-full bg-neutral-800" />
                    </div>
                    <div className="flex-1 grid grid-cols-3 text-center text-xs">
                      <div><div className="font-bold">128</div><div className="text-neutral-400">Posts</div></div>
                      <div><div className="font-bold">12.4k</div><div className="text-neutral-400">Followers</div></div>
                      <div><div className="font-bold">312</div><div className="text-neutral-400">Following</div></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">@yourname</div>
                    <div className="text-xs leading-relaxed bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
                      ✨ Storyteller & creator · turning everyday moments into magic 🌙 DMs open
                    </div>
                  </div>
                  <button className="w-full py-1.5 rounded-md bg-blue-500 text-white text-xs font-semibold">Follow</button>
                </div>
              </div>
            </div>
            {/* LinkedIn desktop mockup */}
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-xl bg-white text-neutral-900 border border-neutral-300 shadow-2xl shadow-primary/20 overflow-hidden">
                <div className="h-7 bg-neutral-100 border-b border-neutral-200 flex items-center gap-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="h-20 bg-gradient-to-r from-blue-700 to-teal-500" />
                <div className="px-4 pb-4 -mt-8">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 border-4 border-white" />
                  <div className="mt-2 space-y-1">
                    <div className="font-bold text-sm">Alex Morgan</div>
                    <div className="text-xs text-neutral-700 leading-relaxed">
                      Product Leader @ TechCo · Helping SaaS teams ship faster. Ex-Google. Speaker, mentor, and lifelong learner.
                    </div>
                    <div className="text-[11px] text-neutral-500">San Francisco · 500+ connections</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">Connect</button>
                    <button className="px-3 py-1 rounded-full border border-neutral-400 text-neutral-700 text-xs font-semibold">Message</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="reviews">
          <Testimonials />
        </section>
      </main>

      {/* Final CTA Banner */}
      <section className="relative overflow-hidden border-y border-border/40">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, hsl(263 70% 40% / 0.45), transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground">
            Your perfect bio is 10 seconds away
          </h2>
          <p className="text-muted-foreground">
            Free forever. No credit card. No signup.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-primary to-purple-500 hover:scale-[1.03] transition-transform shadow-xl shadow-primary/40"
          >
            Generate My Bio Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
