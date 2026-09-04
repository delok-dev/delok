// src/components/landing/Hero.tsx
import { ROUTES } from "@/src/constants/routes";
import { EXTERNAL_LINKS } from "@/src/constants/external-links";
import { ArrowUpRight } from "lucide-react";
import Button from "@/src/components/ui/Button";
import { DelokLogPreview } from "./DelokLogPreview";

export function Hero() {
  return (
    <section className="relative w-full pt-24">
      {/* Log panel — behind the text, pulled up — dimmed ambient texture */}
      <div className="relative w-full -mt-8 animate-hero-log opacity-[0.36]">
        <DelokLogPreview />

        {/* Gradients to hide panel edges */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-40 md:w-56 bg-linear-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-40 md:w-56 bg-linear-to-l from-background via-background/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background to-transparent" />
        </div>
      </div>

      {/* Hero text — overlaps on top of the log panel */}
      <div className="absolute inset-x-0 top-0 z-10">
        {/* Dark backdrop — faint log texture remains visible behind text */}
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/85 via-72% to-transparent pointer-events-none" />

        {/* Text content */}
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="flex flex-col">
            {/* Headline */}
            <h1 className="animate-hero-heading text-6xl md:text-7xl lg:text-8xl font-semibold text-foreground leading-[1.1] mb-6">
              See what your systems are doing.
            </h1>

            {/* CTA */}
            <div className="relative w-fit animate-hero-cta">
              {/* Dark backdrop to dim log rows behind the CTA */}
              <div
                aria-hidden
                className="absolute -inset-x-10 -inset-y-6 bg-background/70 blur-2xl rounded-full pointer-events-none"
              />
              <div className="relative flex flex-wrap items-center gap-3">
                <Button href={ROUTES.AUTH.SIGN_UP} size="lg">
                  Get started
                </Button>
                <Button
                  href={EXTERNAL_LINKS.DOCS}
                  variant="secondary"
                  size="lg"
                  className="group relative rounded-none"
                >
                  View Documentation
                  <ArrowUpRight className="h-4 w-4" />
                  {/* Growing line along the button's bottom edge */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
