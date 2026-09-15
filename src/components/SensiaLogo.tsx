import logoBlack from "@/assets/Logo_BLACK.svg.asset.json";
import logoWhite from "@/assets/Logo_WHITE.svg.asset.json";
import logoPayoffBlack from "@/assets/Logo_payoff_BLACK.svg.asset.json";
import logoPayoffWhite from "@/assets/Logo_payoff_WHITE.svg.asset.json";
import logoPayoffAccent from "@/assets/Logo_payoff_ACCENT.svg.asset.json";
import { cn } from "@/lib/utils";

export function SensiaLogo({
  payoff = false,
  accent = false,
  className,
}: {
  payoff?: boolean;
  accent?: boolean;
  className?: string;
}) {
  if (accent) {
    return (
      <img
        src={logoPayoffAccent.url}
        alt="Sensia — Your data to insight."
        className={cn("block h-auto w-full", className)}
      />
    );
  }

  const lightLogo = payoff ? logoPayoffBlack : logoBlack;
  const darkLogo = payoff ? logoPayoffWhite : logoWhite;
  const alt = payoff ? "Sensia — Your data to insight." : "Sensia";

  return (
    <span className={cn("block", className)}>
      <img src={lightLogo.url} alt={alt} className="h-auto w-full dark:hidden" />
      <img src={darkLogo.url} alt={alt} className="hidden h-auto w-full dark:block" />
    </span>
  );
}