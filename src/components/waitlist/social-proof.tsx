import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Nice, it's like ChatGPT that can save files for me! It looks very nice.",
    author: "Mark Nazzaro",
    role: "CTO",
    company: "Compyle (YC F25)",
  },
  {
    quote: "This is a game changer and a very big thing. I want early access!",
    author: "Idrees Qazi",
    role: "Web Dev & Student",
    company: "",
  },
  {
    quote: "We're crafting an extraordinary UX layer on top of cutting-edge AI infrastructure—streaming, file versioning, tool orchestration. The vision? Collect enough agent execution data to build something truly proprietary and revolutionary.",
    author: "Yethikrishna R",
    role: "Founder & Developer of y0",
    company: "Coordinator at Compyle",
  },
];

// Shuffled company order
const companies = [
  "Anthropic", "Compyle", "Google DeepMind", "ByteDance", "Zhipu AI",
  "Flames AI", "Codebuff", "OpenAI", "Doubao Seed", "Meta AI"
];

export const SocialProof = () => {
  return (
    <section className="py-24 px-6 bg-muted/30 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by forward-thinkers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of professionals who are already transforming their workflows.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 rounded-2xl h-full flex flex-col">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-foreground mb-6 flex-1 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.author.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-muted-foreground text-xs">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company logos marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              Trusted by teams at leading AI companies
            </p>
          </div>

          <div className="relative overflow-hidden">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={`${company}-${index}`}
                  className="flex-shrink-0 px-4"
                >
                  <div className="px-6 py-3 rounded-xl bg-card border text-muted-foreground font-medium whitespace-nowrap">
                    {company}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};