import { Pencil, Share2, Sparkles, Users } from "lucide-react";

const features = [
  {
    icon: Pencil,
    title: "Intuitive Drawing",
    description: "Simple yet powerful tools that feel natural and responsive.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time, seamlessly.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your creations with a simple link, no signup required.",
  },
  {
    icon: Sparkles,
    title: "Beautiful Results",
    description:
      "Create professional-looking diagrams and sketches effortlessly.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to bring ideas to life
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in border border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
