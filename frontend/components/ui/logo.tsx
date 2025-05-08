import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 28 },
    md: { width: 140, height: 40 },
    lg: { width: 200, height: 57 },
  }

  return (
    <Link href="/" className={className}>
      <Image
        src="/doxaria.png"
        alt="Doxaria"
        width={sizes[size].width}
        height={sizes[size].height}
        priority
        className="object-contain"
      />
    </Link>
  )
}
