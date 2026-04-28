import Image from "next/image";

/** Matches `public/logo.png` — favicon uses the same asset in `app/layout.tsx`. */
export const LOGO_SRC = "/logo.png";

type SiteLogoProps = {
  /** Navbar ~36px tall; footer slightly larger; hero optional prominence */
  variant?: "navbar" | "footer" | "hero";
  className?: string;
  priority?: boolean;
};

const dims = {
  navbar: { width: 150, height: 40, className: "h-9 w-auto max-h-9" },
  footer: { width: 170, height: 44, className: "h-10 w-auto max-h-11" },
  hero: { width: 200, height: 52, className: "h-11 sm:h-12 w-auto" },
} as const;

export default function SiteLogo({
  variant = "navbar",
  className = "",
  priority = false,
}: SiteLogoProps) {
  const d = dims[variant];
  return (
    <Image
      src={LOGO_SRC}
      alt="UK Trade"
      width={d.width}
      height={d.height}
      priority={priority}
      className={`object-contain object-left ${d.className} ${className}`}
    />
  );
}
