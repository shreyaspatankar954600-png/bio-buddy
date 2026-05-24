import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Finally a bio that doesn't sound like a robot wrote it.",
    name: "Priya S.",
    role: "Lifestyle Influencer, Mumbai",
  },
  {
    quote: "Got 3 connection requests within an hour of updating my LinkedIn bio.",
    name: "Rohan M.",
    role: "SaaS Founder",
  },
  {
    quote: "Saved me 2 hours of overthinking. Generated, copied, done.",
    name: "Anika T.",
    role: "Freelance Photographer",
  },
];

const Testimonials = () => (
  <section className="animate-fade-in-up space-y-6">
    <h3 className="text-center text-xl sm:text-2xl font-bold text-foreground">
      Trusted by creators, founders & professionals
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TESTIMONIALS.map((t) => (
        <div
          key={t.name}
          className="glass rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors"
        >
          <div className="flex gap-0.5 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <p className="text-sm italic text-foreground/90 leading-relaxed">
            "{t.quote}"
          </p>
          <div className="mt-auto">
            <p className="text-sm font-semibold text-foreground">— {t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
